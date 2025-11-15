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

## Advanced
- **Storage**: OPFS first (Chrome), fallback to IDB chunk-append + assemble.
- **Integrity**: If `integritySha256` provided, SHA-256 verified on assembled Blob.
- **Idle-aware**: Defers when foreground network activity detected; resumes on idle.
- **Resume**: Uses Range with adaptive chunk size to continue from last offset.

## Documentation

완전한 문서, 사용 예제 및 API 레퍼런스는 문서 사이트에서 확인하세요:

```bash
# 문서 사이트 개발 서버 실행
npm run docs:develop

# 문서 사이트 빌드
npm run docs:build
```

문서 사이트는 `http://localhost:8000` 에서 확인할 수 있습니다.

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
