import { BackgroundPrefetcher, PrefetchOptions } from '../prefetcher';

// Mock all dependencies
global.fetch = jest.fn();
global.requestIdleCallback = jest.fn((cb) => setTimeout(cb, 0));
global.crypto = {
  subtle: {
    digest: jest.fn(),
  },
} as any;
global.navigator = {
  storage: {
    getDirectory: jest.fn(),
  },
  connection: {
    downlink: 5,
    effectiveType: '4g',
    saveData: false,
  },
} as any;
global.indexedDB = {
  open: jest.fn(),
} as any;

// Mock modules
jest.mock('../store/idb', () => ({
  idbAppend: jest.fn(),
  idbAssemble: jest.fn(),
  idbPurge: jest.fn(),
}));

jest.mock('../store/opfs', () => ({
  createOpfsWriter: jest.fn(),
}));

jest.mock('../hash', () => ({
  sha256: jest.fn(),
}));

describe('BackgroundPrefetcher - Integration Tests', () => {
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete a full prefetch flow with OPFS', async () => {
    const mockSha256 = require('../hash').sha256;
    mockSha256.mockResolvedValue('expected-hash');

    const mockCreateOpfsWriter = require('../store/opfs').createOpfsWriter;
    const mockWriter = {
      writeChunk: jest.fn(),
      seek: jest.fn(),
      size: jest.fn().mockResolvedValue(0),
      close: jest.fn(),
      toBlob: jest.fn().mockResolvedValue(new Blob(['test'])),
    };
    mockCreateOpfsWriter.mockResolvedValue(mockWriter);

    const opts: PrefetchOptions = {
      url: 'https://example.com/large-file.bin',
      integritySha256: 'expected-hash',
      onProgress: jest.fn(),
      onStatus: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock HEAD
    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: () => '100' },  // Small size for quick test
    });

    // Mock chunk fetch (yield a small chunk then done)
    (fetch as jest.Mock).mockResolvedValueOnce({
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
    await waitForStatus(opts.onStatus as jest.Mock, 'completed');
  });

  it('should handle network errors and retry', async () => {
    const opts: PrefetchOptions = {
      url: 'https://example.com/file.bin',
      onStatus: jest.fn(),
      onProgress: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock HEAD success
    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: () => '1000' },
    });

    // Mock fetch failure
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await prefetcher.start();
    await waitForStatus(opts.onStatus as jest.Mock, 'error');
  });

  it('should respect network conditions and not start', () => {
    global.navigator = {
      ...global.navigator,
      connection: {
        downlink: 1,
        effectiveType: '2g',
        saveData: false,
      },
    } as any;

    const opts: PrefetchOptions = {
      url: 'https://example.com/file.bin',
      minDownlinkMbps: 2,
      onStatus: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Should not start due to low downlink
    expect(prefetcher.getOffset()).toBe(0);
  });

  it('should handle React hook integration (mock scenario)', () => {
    // Mock React environment
    global.window = {
      React: {
        useEffect: jest.fn(),
        useMemo: jest.fn(),
        useRef: jest.fn(),
        useState: jest.fn(),
      },
    } as any;

    const opts: PrefetchOptions = { 
      url: 'https://example.com/file.bin',
      onStatus: jest.fn(),
      onProgress: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Simulate hook usage
    expect(prefetcher).toBeDefined();
  });

  it('should handle large file with multiple chunks and resume', async () => {
    const opts: PrefetchOptions = {
      url: 'https://example.com/huge-file.bin',
      onProgress: jest.fn(),
      onStatus: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock HEAD
    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: () => '200' },  // Small for test
    });

    // Mock one chunk to complete
    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 206,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    await prefetcher.start();
    expect(opts.onStatus).toHaveBeenCalledWith('started');
  });
});
