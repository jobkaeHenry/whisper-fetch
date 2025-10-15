import { BackgroundPrefetcher, PrefetchOptions, Prefetcher } from './prefetcher.js';
import { requestIdle, delay } from './net.js';

export interface ManagedPrefetchOptions extends PrefetchOptions {
  priority?: number;  // 기본값: 0, 높을수록 우선 (음수 가능)
  id?: string;       // 고유 ID (미지정 시 자동 생성)
}

export interface PrefetchManager {
  add(opts: ManagedPrefetchOptions): string;  // 요청 추가 후 ID 반환
  remove(id: string): boolean;               // 요청 제거
  pause(id?: string): void;                  // 특정 또는 전체 일시정지
  resume(id?: string): void;                 // 특정 또는 전체 재개
  stop(id?: string): void;                   // 특정 또는 전체 중단
  getStatus(id: string): { status: string; progress: { done: number; total?: number } } | null;
  purge(id: string): Promise<void>;          // 특정 요청 정리
}

class PriorityQueue {
  private items: { opts: ManagedPrefetchOptions; id: string; priority: number }[] = [];

  enqueue(opts: ManagedPrefetchOptions, id: string) {
    const priority = opts.priority ?? 0;
    this.items.push({ opts, id, priority });
    this.items.sort((a, b) => b.priority - a.priority);  // 높은 우선순위 먼저
  }

  dequeue(): { opts: ManagedPrefetchOptions; id: string } | null {
    return this.items.shift() || null;
  }

  remove(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export class PrefetchManagerImpl implements PrefetchManager {
  private queue = new PriorityQueue();
  private active: Map<string, BackgroundPrefetcher> = new Map();
  private maxConcurrent = 2;  // 동시 처리 제한
  private paused = false;

  add(opts: ManagedPrefetchOptions): string {
    const id = opts.id ?? `prefetch-${Date.now()}-${Math.random()}`;
    this.queue.enqueue(opts, id);
    this.processQueue();
    return id;
  }

  remove(id: string): boolean {
    this.active.get(id)?.stop();
    this.active.delete(id);
    return this.queue.remove(id);
  }

  pause(id?: string): void {
    if (id) {
      this.active.get(id)?.pause();
    } else {
      this.paused = true;
      this.active.forEach(p => p.pause());
    }
  }

  resume(id?: string): void {
    if (id) {
      this.active.get(id)?.resume();
    } else {
      this.paused = false;
      this.processQueue();
    }
  }

  stop(id?: string): void {
    if (id) {
      this.active.get(id)?.stop();
      this.active.delete(id);
    } else {
      this.active.forEach(p => p.stop());
      this.active.clear();
    }
  }

  getStatus(id: string): { status: string; progress: { done: number; total?: number } } | null {
    const p = this.active.get(id);
    if (p) {
      return {
        status: 'active',
        progress: { done: p.getOffset(), total: p.getTotal() }
      };
    }
    return this.queue.items.some(item => item.id === id) ? { status: 'queued', progress: { done: 0 } } : null;
  }

  async purge(id: string): Promise<void> {
    const p = this.active.get(id);
    if (p) {
      await p.purge();
      this.remove(id);
    }
  }

  private processQueue() {
    if (this.paused || this.active.size >= this.maxConcurrent) return;
    requestIdle(() => {
      while (!this.queue.isEmpty() && this.active.size < this.maxConcurrent && !this.paused) {
        const { opts, id } = this.queue.dequeue()!;
        const prefetcher = new BackgroundPrefetcher(opts);
        this.active.set(id, prefetcher);
        prefetcher.start().catch(e => {
          this.active.delete(id);
          this.processQueue();
        });
        const originalOnStatus = opts.onStatus;
        opts.onStatus = (s, e) => {
          originalOnStatus?.(s, e);
          if (s === 'completed' || s === 'stopped' || s === 'error') {
            this.active.delete(id);
            delay(1000).then(() => this.processQueue());
          }
        };
      }
    }, 100);
  }
}
