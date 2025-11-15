# Whisper Fetch

더 나은 UX를 위해 대용량 파일을 네트워크 아이들 상태에서 백그라운드에서 청크로 프리패치하는 라이브러리. Idle-aware, resumable background prefetch (Range + Abort) with OPFS/IDB storage. Next.js ready.

## Features
- Pause on foreground network activity; resume on idle
- Adaptive chunk (512KB–4MB) + Range resume
- OPFS streaming (Chrome) / IndexedDB fallback
- SHA-256 integrity (optional)
- Next.js CSR safe (SSR guarded)

## Installation
```bash
npm install @jobkaehenry/whisper-fetch
```

## Quick Start
```ts
import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

const prefetch = new BackgroundPrefetcher({ url: 'https://cdn/.../file.bin' });
prefetch.start();
```

React:
```ts
import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';
const { progress, status, objectURL } = usePrefetcher({ url: '...' });
```

## Options
- `allowOnCellular` (default false): Allow prefetch on cellular networks
- `respectSaveData` (default true): Respect user's data saver mode
- `minDownlinkMbps` (default 2): Minimum network speed
- `chunkSize` omit → adaptive based on network
- `integritySha256` for on-complete verification
- `store`: 'opfs' | 'idb' (default 'opfs' with fallback)

## API
- **`new BackgroundPrefetcher(opts)`**
  - `url: string` Target file URL
  - `allowOnCellular?: boolean`
  - `respectSaveData?: boolean`
  - `minDownlinkMbps?: number`
  - `chunkSize?: number`
  - `integritySha256?: string`
  - `onProgress?: (downloaded: number, total?: number) => void`
  - `onStatus?: (status: 'started'|'paused'|'resumed'|'stopped'|'completed'|'error', error?: any) => void`
- **`start(): Promise<void>`** Begin background prefetch respecting idle.
- **`pause(): void`** Pause immediately.
- **`resume(): Promise<void>`** Resume respecting idle.
- **`stop(): void`** Stop and cleanup.
- **`getObjectURL(): Promise<string|null>`** Assembled Blob URL if available.

## Events
- **`started`** Prefetch loop began.
- **`paused`** Suspended due to foreground activity or manual pause.
- **`resumed`** Resumed after idle.
- **`completed`** All bytes fetched and assembled.
- **`stopped`** Stopped by `stop()`.
- **`error`** Irrecoverable error occurred.

## Server Requirements
- HTTP Range support (206 Partial Content)
- ETag/If-Range recommended for safe resume

## React Hook
```ts
import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

const { status, progress, start, pause, resume, stop, objectURL } = usePrefetcher({
  url: 'https://cdn/.../file.bin',
  integritySha256: '...optional...'
});
```

## Parallel URL Fetching (PrefetchManager)

병렬로 여러 URL을 동시에 다운로드하여 병목 현상을 제거합니다.

### Basic Usage
```ts
import { PrefetchManagerImpl } from '@jobkaehenry/whisper-fetch';

// 동시에 5개까지 다운로드
const manager = new PrefetchManagerImpl(5);

// 단일 URL 추가
const id = manager.add({
  url: 'https://cdn.example.com/video1.mp4',
  priority: 10,  // 높을수록 우선순위가 높음
  onProgress: (done, total) => console.log(`${done}/${total}`)
});

// 여러 URL 일괄 추가
const ids = manager.addBatch([
  'https://cdn.example.com/video1.mp4',
  'https://cdn.example.com/video2.mp4',
  { url: 'https://cdn.example.com/video3.mp4', priority: 5 }
]);

// 상태 확인
const status = manager.getStatus(id);
// { status: 'active' | 'queued', progress: { done: number, total?: number } }

// 동시 다운로드 수 동적 변경
manager.setMaxConcurrent(10);

// 일시정지/재개/중단
manager.pause(id);      // 특정 ID만
manager.pause();        // 전체 일시정지
manager.resume(id);     // 특정 ID만
manager.resume();       // 전체 재개
manager.stop(id);       // 특정 ID만
manager.stop();         // 전체 중단

// 제거
manager.remove(id);
await manager.purge(id);
```

### PrefetchManager API
- **`new PrefetchManagerImpl(maxConcurrent?: number)`** Create manager with concurrent limit (default: 2)
- **`add(opts: ManagedPrefetchOptions): string`** Add single URL, returns ID
- **`addBatch(urls: (string | ManagedPrefetchOptions)[]): string[]`** Add multiple URLs at once
- **`setMaxConcurrent(n: number): void`** Adjust concurrent download limit
- **`pause(id?: string): void`** Pause specific or all downloads
- **`resume(id?: string): void`** Resume specific or all downloads
- **`stop(id?: string): void`** Stop specific or all downloads
- **`remove(id: string): boolean`** Remove from queue
- **`getStatus(id: string)`** Get download status and progress
- **`purge(id: string): Promise<void>`** Clean up downloaded data

### ManagedPrefetchOptions
`BackgroundPrefetcher`의 모든 옵션에 추가로:
- **`priority?: number`** 우선순위 (기본값: 0, 높을수록 먼저 처리)
- **`id?: string`** 고유 ID (미지정시 자동 생성)

### Use Cases
```ts
// 대용량 비디오 여러 개 미리 다운로드
const manager = new PrefetchManagerImpl(3);
const videoIds = manager.addBatch([
  { url: '/videos/ep1.mp4', priority: 10 },  // 현재 에피소드는 우선순위 높게
  { url: '/videos/ep2.mp4', priority: 5 },
  { url: '/videos/ep3.mp4', priority: 1 }
]);

// 네트워크 상태에 따라 동시 다운로드 수 조정
if (navigator.connection?.effectiveType === '4g') {
  manager.setMaxConcurrent(10);
} else {
  manager.setMaxConcurrent(2);
}
```

## Advanced
- **Storage**: OPFS first (Chrome), fallback to IDB chunk-append + assemble.
- **Integrity**: If `integritySha256` provided, SHA-256 verified on assembled Blob.
- **Idle-aware**: Defers when foreground network activity detected; resumes on idle.
- **Resume**: Uses Range with adaptive chunk size to continue from last offset.

## Testing
Run tests with:
```bash
npm test
```

E2E (Playwright) after installing dev deps:
```bash
npm run build
npx playwright test
```

## Browser Support
- Chrome 114+ (OPFS streaming). Other modern browsers supported via IDB fallback.

## License
MIT
