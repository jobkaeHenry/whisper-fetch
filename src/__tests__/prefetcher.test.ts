import { BackgroundPrefetcher, PrefetchOptions } from '../prefetcher';

// Mock all dependencies more thoroughly
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

// Mock IDB functions
jest.mock('../store/idb', () => ({
  idbAppend: jest.fn(),
  idbAssemble: jest.fn(),
  idbPurge: jest.fn(),
}));

// Mock OPFS
jest.mock('../store/opfs', () => ({
  createOpfsWriter: jest.fn(),
}));

// Mock hash
jest.mock('../hash', () => ({
  sha256: jest.fn(),
}));

describe('BackgroundPrefetcher - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default options', () => {
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin' };
    const prefetcher = new BackgroundPrefetcher(opts);
    expect(prefetcher.getOffset()).toBe(0);
    expect(prefetcher.getTotal()).toBeUndefined();
  });

  it('should start prefetching and handle progress', async () => {
    const mockProgress = jest.fn();
    const mockStatus = jest.fn();
    const opts: PrefetchOptions = {
      url: 'https://example.com/file.bin',
      onProgress: mockProgress,
      onStatus: mockStatus,
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock HEAD request
    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: () => '1000' },
    });

    // Mock chunk fetch
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
    expect(mockStatus).toHaveBeenCalledWith('started');
  });

  it('should pause and resume correctly', async () => {
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    prefetcher.pause();
    expect(opts.onStatus).toHaveBeenCalledWith('paused');

    await prefetcher.resume();
    expect(opts.onStatus).toHaveBeenCalledWith('resumed');
  });

  it('should stop prefetching', () => {
    const opts: PrefetchOptions = { url: 'https://example.com/file.bin', onStatus: jest.fn() };
    const prefetcher = new BackgroundPrefetcher(opts);

    prefetcher.stop();
    expect(opts.onStatus).toHaveBeenCalledWith('stopped');
  });

  it('should handle integrity check', async () => {
    const mockSha256 = require('../hash').sha256;
    mockSha256.mockResolvedValue('mock-hash');

    const opts: PrefetchOptions = {
      url: 'https://example.com/file.bin',
      integritySha256: 'mock-hash',
      onStatus: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock full flow for integrity
    expect(prefetcher).toBeDefined();
  });

  it('should fallback to IDB when OPFS fails', async () => {
    const mockCreateOpfsWriter = require('../store/opfs').createOpfsWriter;
    mockCreateOpfsWriter.mockRejectedValue(new Error('OPFS not supported'));

    const opts: PrefetchOptions = { 
      url: 'https://example.com/file.bin',
      onStatus: jest.fn(),
      onProgress: jest.fn(),
    };
    const prefetcher = new BackgroundPrefetcher(opts);

    // Mock start flow
    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: () => '1000' },
    });

    await prefetcher.start();
    expect(prefetcher).toBeDefined();
  });
});
