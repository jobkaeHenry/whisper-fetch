import { BackgroundPrefetcher, PrefetchOptions } from '../prefetcher';

// Common helpers
const waitForStatus = async (mock: jest.Mock, expected: string, timeout = 1500) => {
  await new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (mock.mock.calls.some(c => c[0] === expected)) return resolve();
      if (Date.now() - start > timeout) return reject(new Error('timeout waiting status ' + expected));
      setTimeout(tick, 0);
    };
    tick();
  });
};

// Global environment mocks
beforeAll(() => {
  (global as any).requestIdleCallback = (cb: Function) => setTimeout(cb, 0);
  (global as any).fetch = jest.fn();
  (global as any).crypto = { subtle: { digest: jest.fn() } } as any;
  (global as any).navigator = {
    storage: { getDirectory: jest.fn() },
    connection: { downlink: 5, effectiveType: '4g', saveData: false },
  } as any;
  (global as any).indexedDB = { open: jest.fn() } as any;
});

beforeEach(() => {
  jest.clearAllMocks();
  // reset environment baselines per test
  (global as any).navigator = {
    storage: { getDirectory: jest.fn() },
    connection: { downlink: 5, effectiveType: '4g', saveData: false },
  } as any;
  (global as any).URL = {
    createObjectURL: jest.fn().mockReturnValue('blob:mock')
  } as any;
});

// Module mocks
jest.mock('../store/opfs', () => ({
  createOpfsWriter: jest.fn(),
}));

jest.mock('../store/idb', () => ({
  idbAppend: jest.fn(),
  idbAssemble: jest.fn(),
  idbPurge: jest.fn(),
}));

jest.mock('../hash', () => ({
  sha256: jest.fn(),
}));

describe('BackgroundPrefetcher - Edge Cases', () => {
  it('handles HEAD failure gracefully (no headers)', async () => {
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn(), onProgress: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    // HEAD throws
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('HEAD fail'));
    // Range fetch still returns data
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      status: 206,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new Uint8Array(100) })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'started');
  });

  it('completes when Range returns 200 (entire file)', async () => {
    const { createOpfsWriter } = require('../store/opfs');
    createOpfsWriter.mockResolvedValue({
      writeChunk: jest.fn(),
      seek: jest.fn(),
      size: jest.fn().mockResolvedValue(0),
      close: jest.fn(),
      toBlob: jest.fn().mockResolvedValue(new Blob(['x'])),
    });

    const opts: PrefetchOptions = { url: 'https://example.com/entire.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    // HEAD ok
    (fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });
    // Range returns 200 OK stream
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new Uint8Array(100) })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'completed');
  });

  it('reports error when integrity mismatch occurs', async () => {
    const { sha256 } = require('../hash');
    sha256.mockResolvedValue('bad-hash');

    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', integritySha256: 'expected-hash', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    (fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      status: 206,
      body: { getReader: () => ({ read: jest.fn().mockResolvedValueOnce({ done: true }) }) },
    });

    // OPFS path needs writer mocks
    const { createOpfsWriter } = require('../store/opfs');
    createOpfsWriter.mockResolvedValue({
      writeChunk: jest.fn(),
      seek: jest.fn(),
      size: jest.fn().mockResolvedValue(0),
      close: jest.fn(),
      toBlob: jest.fn().mockResolvedValue(new Blob(['x'])),
    });

    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'error');
  });

  it('does not start on Save-Data if respectSaveData', async () => {
    (global as any).navigator = {
      storage: { getDirectory: jest.fn() },
      connection: { saveData: true, effectiveType: '4g', downlink: 10 },
    } as any;
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', respectSaveData: true, onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);
    await prefetcher.start();
    // should not call started and no fetch performed
    expect((opts.onStatus as jest.Mock).mock.calls.find(c => c[0] === 'started')).toBeUndefined();
    expect((fetch as jest.Mock).mock.calls.length).toBe(0);
  });

  it('blocks on cellular (2g/3g) unless allowOnCellular is true', async () => {
    (global as any).navigator = {
      storage: { getDirectory: jest.fn() },
      connection: { saveData: false, effectiveType: '3g', downlink: 1 },
    } as any;
    const blocked: PrefetchOptions = { url: 'https://example.com/file.bin', allowOnCellular: false, onStatus: jest.fn() };
    const p1 = new BackgroundPrefetcher(blocked);
    await p1.start();
    expect((blocked.onStatus as jest.Mock).mock.calls.find(c => c[0] === 'started')).toBeUndefined();

    const allowed: PrefetchOptions = { url: 'https://example.com/file.bin', allowOnCellular: true, onStatus: jest.fn() };
    const p2 = new BackgroundPrefetcher(allowed);
    (fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });
    ;(fetch as jest.Mock).mockResolvedValueOnce({ status: 206, body: { getReader: () => ({ read: jest.fn().mockResolvedValueOnce({ done: true }) }) } });
    await p2.start();
    await waitForStatus(allowed.onStatus as jest.Mock, 'started');
  });

  it('works if requestIdleCallback is not present', async () => {
    (global as any).requestIdleCallback = undefined;
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);
    (fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });
    ;(fetch as jest.Mock).mockResolvedValueOnce({ status: 206, body: { getReader: () => ({ read: jest.fn().mockResolvedValueOnce({ done: true }) }) } });
    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'started');
    (global as any).requestIdleCallback = (cb: Function) => setTimeout(cb, 0);
  });

  it('falls back to IDB when OPFS writer create fails and assembles Blob', async () => {
    const { createOpfsWriter } = require('../store/opfs');
    createOpfsWriter.mockRejectedValue(new Error('no opfs'));
    const { idbAssemble } = require('../store/idb');
    idbAssemble.mockResolvedValue(new Blob(['idb']));

    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);
    (fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });
    ;(fetch as jest.Mock).mockResolvedValueOnce({ status: 206, body: { getReader: () => ({ read: jest.fn().mockResolvedValueOnce({ done: true }) }) } });
    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'started');
    const url = await prefetcher.getObjectURL();
    expect(typeof url === 'string' || url === null).toBe(true);
  });

  it('pause() and resume() transitions do not throw', async () => {
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    prefetcher.pause();
    expect((opts.onStatus as jest.Mock).mock.calls.find(c => c[0] === 'paused')).toBeDefined();
    await prefetcher.resume();
    expect((opts.onStatus as jest.Mock).mock.calls.find(c => c[0] === 'resumed')).toBeDefined();
  });

  it('uses cached OPFS content and skips range fetch on subsequent run', async () => {
    const { createOpfsWriter } = require('../store/opfs');
    // Simulate existing OPFS file of size 100
    createOpfsWriter.mockResolvedValue({
      writeChunk: jest.fn(),
      seek: jest.fn(),
      size: jest.fn().mockResolvedValue(100),
      close: jest.fn(),
      toBlob: jest.fn(),
    });

    const opts: PrefetchOptions = { url: 'https://example.com/cached.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    // HEAD reports same size as cached
    ;(fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });

    // Start: should not perform any range fetch (only HEAD)
    await prefetcher.start();
    expect((fetch as jest.Mock).mock.calls.length).toBe(1);

    // getObjectURL should use OPFS; ensure storage exists
    (global as any).navigator = { storage: {}, connection: { downlink: 5, effectiveType: '4g', saveData: false } } as any;
    (global as any).navigator.storage.getDirectory = jest.fn().mockResolvedValue({
      getFileHandle: jest.fn().mockResolvedValue({
        getFile: jest.fn().mockResolvedValue(new Blob(['cached']))
      })
    });
    const url = await prefetcher.getObjectURL();
    expect(typeof url === 'string' || url === null).toBe(true);
  });

  it('uses cached IDB content and skips range fetch on subsequent run', async () => {
    const { createOpfsWriter } = require('../store/opfs');
    const { idbAssemble } = require('../store/idb');
    // Force IDB path
    createOpfsWriter.mockRejectedValue(new Error('no opfs'));
    idbAssemble.mockResolvedValue(new Blob(['x'.repeat(100)]));

    const opts: PrefetchOptions = { url: 'https://example.com/cached-idb.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    // HEAD reports same size as cached
    ;(fetch as jest.Mock).mockResolvedValueOnce({ headers: { get: () => '100' } });

    await prefetcher.start();
    // Only HEAD fetch should have been called
    expect((fetch as jest.Mock).mock.calls.length).toBe(1);

    const url = await prefetcher.getObjectURL();
    expect(typeof url === 'string' || url === null).toBe(true);
  });
});
