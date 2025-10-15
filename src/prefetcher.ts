import { attachNetworkActivityObserver, canStartPrefetch, delay, effectiveDownlinkMbps, getLastActivity, requestIdle } from './net';
import { createOpfsWriter } from './store/opfs';
import { idbAppend, idbAssemble, idbPurge } from './store/idb';
import { sha256 } from './hash';

export interface PrefetchOptions {
  url: string;
  cacheKey?: string;              // 파일명/키
  chunkSize?: number;             // 미지정 시 adaptive
  minIdleMs?: number;             // 기본 3000ms
  allowOnCellular?: boolean;      // 기본 false
  minDownlinkMbps?: number;       // 기본 2
  respectSaveData?: boolean;      // 기본 true
  integritySha256?: string;       // 선택: 무결성 검증
  store?: 'opfs' | 'idb';         // 기본 opfs 우선 → fallback
  onProgress?: (done: number, total?: number) => void;
  onStatus?: (s: 'started' | 'paused' | 'resumed' | 'completed' | 'stopped' | 'error', e?: any) => void;
}

export interface Prefetcher {
  start(): Promise<void>;
  pause(): void;
  resume(): Promise<void>;
  stop(): void;
  getOffset(): number;
  getTotal(): number | undefined;
  getObjectURL(): Promise<string | null>;
  purge(): Promise<void>;
}

function pickAdaptiveChunkSize(fixed?: number) {
  if (fixed) return fixed;
  const down = effectiveDownlinkMbps();
  if (down > 10) return 4_000_000;
  if (down > 2)  return 1_000_000;
  return 512_000;
}

export class BackgroundPrefetcher implements Prefetcher {
  private opts: PrefetchOptions;
  private url: string;
  private cacheKey: string;
  private controller?: AbortController;
  private downloaded = 0;
  private total?: number;
  private running = false;
  private usingOpfs = false;

  constructor(opts: PrefetchOptions) {
    if (typeof window === 'undefined') throw new Error('Prefetcher is browser-only');
    this.opts = { minIdleMs: 3000, respectSaveData: true, minDownlinkMbps: 2, store: 'opfs', onStatus: () => {}, ...opts };
    this.url = this.opts.url;
    const u = new URL(this.url, location.href);
    this.cacheKey = this.opts.cacheKey ?? u.pathname.split('/').pop() ?? 'prefetch.bin';
    attachNetworkActivityObserver();
  }

  getOffset() { return this.downloaded; }
  getTotal() { return this.total; }

  async start(): Promise<void> {
    if (this.running) return;
    if (!canStartPrefetch(this.opts)) return;
    this.running = true;
    this.opts.onStatus?.('started');
    await this.fetchHead();
    requestIdle(() => { void this.loop(); });
  }

  pause(): void {
    this.controller?.abort();
    this.running = false;
    this.opts.onStatus?.('paused');
  }

  async resume(): Promise<void> {
    if (this.running) return;
    if (!canStartPrefetch(this.opts)) return;
    this.running = true;
    this.opts.onStatus?.('resumed');
    requestIdle(() => { void this.loop(); });
  }

  stop(): void {
    this.controller?.abort();
    this.running = false;
    this.opts.onStatus?.('stopped');
  }

  async purge(): Promise<void> {
    await idbPurge(this.cacheKey); // OPFS는 파일 덮어쓰기 방식이라 purge는 IDB만 처리(간소화)
    this.downloaded = 0;
  }

  private async fetchHead() {
    try {
      const res: any = await fetch(this.url, { method: 'HEAD' });
      const cl = res?.headers?.get ? res.headers.get('content-length') : null;
      this.total = cl ? parseInt(cl, 10) : undefined;
    } catch {
      this.total = undefined;
    }
  }

  private async idleWait() {
    const minIdle = this.opts.minIdleMs ?? 3000;
    while (this.running && (Date.now() - getLastActivity()) < minIdle) {
      await delay(250);
    }
  }

  private async loop() {
    // writer 준비: OPFS 우선, 안되면 IDB
    let writer:
      | { mode: 'opfs', writeChunk: (u: Uint8Array) => Promise<void>, seek: (pos: number)=>Promise<void>, close: ()=>Promise<void>, toBlob: ()=>Promise<Blob>, size: ()=>Promise<number> }
      | { mode: 'idb', writeChunk: (u: Uint8Array, start: number)=>Promise<void>, close: ()=>Promise<void>, toBlob: ()=>Promise<Blob|null>, size: ()=>Promise<number> };

    try {
      const w = await createOpfsWriter(this.cacheKey);
      this.usingOpfs = true;
      writer = {
        mode: 'opfs',
        writeChunk: (u) => w.writeChunk(u),
        seek: (p) => w.seek(p),
        close: () => w.close(),
        toBlob: () => w.toBlob(),
        size: () => w.size()
      };
    } catch {
      this.usingOpfs = false;
      writer = {
        mode: 'idb',
        writeChunk: (u, start) => idbAppend(this.cacheKey, start, new Blob([u.buffer as ArrayBuffer])),
        close: async () => {},
        toBlob: () => idbAssemble(this.cacheKey),
        size: async () => {
          const b = await idbAssemble(this.cacheKey);
          return b?.size ?? 0;
        }
      };
    }

    // 이미 받은 크기 복구
    this.downloaded = await writer.size();

    while (this.running && (this.total === undefined || this.downloaded < this.total)) {
      await this.idleWait();
      if (!this.running) break;

      const start = this.downloaded;
      const size = pickAdaptiveChunkSize(this.opts.chunkSize);
      const end = this.total ? Math.min(start + size - 1, this.total - 1) : start + size - 1;

      this.controller = new AbortController();
      const t0 = performance.now();
      try {
        const res = await fetch(this.url, {
          headers: { Range: `bytes=${start}-${end}` },
          signal: this.controller.signal,
          // @ts-ignore
          priority: 'low'
        });
        if (!(res.status === 206 || res.status === 200)) throw new Error('Range unsupported or bad status');

        const reader = res.body!.getReader();
        let received = 0;
        // OPFS는 시크 후 직접 write, IDB는 start 오프셋 필요
        if (this.usingOpfs) await (writer as any).seek(start);

        for (;;) {
          if (!this.running) break;
          if ((Date.now() - getLastActivity()) < 500) { this.pause(); break; }
          const { done, value } = await reader.read();
          if (done) break;
          received += value.length;
          if (this.usingOpfs) {
            await (writer as any).writeChunk(value);
          } else {
            await (writer as any).writeChunk(value, start + received - value.length);
          }
          this.opts.onProgress?.(this.downloaded + received, this.total);
        }

        const dt = performance.now() - t0;
        // 적응형 chunk 튜닝은 외부로 뺄 수도 있음(간소화)

        this.downloaded += received;
        if (this.total && this.downloaded >= this.total) {
          await (writer as any).close();
          const blob = await (writer as any).toBlob();
          if (blob && this.opts.integritySha256) {
            const h = await sha256(blob);
            if (h !== this.opts.integritySha256) {
              this.opts.onStatus?.('error', new Error('Integrity mismatch'));
              return;
            }
          }
          this.opts.onStatus?.('completed');
          this.running = false;
          break;
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        this.opts.onStatus?.('error', e);
        // backoff 후 재시도
        await delay(1500);
      } finally {
        this.controller = undefined;
      }
      await delay(30);
    }
  }

  async getObjectURL(): Promise<string | null> {
    // OPFS면 즉시 파일 핸들에서 Blob, IDB면 assemble
    try {
      if (this.usingOpfs) {
        // OPFS는 파일 이름 동일: 새 writer 열어서 파일 조회
        // @ts-ignore
        const root = await (navigator as any).storage.getDirectory();
        const fh = await root.getFileHandle(this.cacheKey, { create: false });
        const f = await fh.getFile();
        return URL.createObjectURL(f);
      }
    } catch {}
    const blob = await idbAssemble(this.cacheKey);
    return blob ? URL.createObjectURL(blob) : null;
  }
}
