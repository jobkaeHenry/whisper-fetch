let lastActivity = 0;

export function now() { return Date.now(); }

export function attachNetworkActivityObserver() {
  if (typeof window === 'undefined') return;
  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        // 주요 전경 네트워크: fetch/xhr 만으로도 충분
        // @ts-ignore
        if (e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest') {
          lastActivity = now();
        }
      }
    });
    po.observe({ type: 'resource', buffered: true });
  } catch {}
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastActivity = now();
  });
}

export function markActivity() { lastActivity = now(); }

export function getLastActivity() { return lastActivity; }

export function requestIdle(cb: () => void, timeout = 5000) {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.requestIdleCallback)
    // @ts-ignore
    window.requestIdleCallback(cb, { timeout });
  else setTimeout(cb, 0);
}

export function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export function effectiveDownlinkMbps(): number {
  // @ts-ignore
  return typeof navigator !== 'undefined' && navigator.connection?.downlink ? navigator.connection.downlink : 5;
}

export function canStartPrefetch(opts: {
  allowOnCellular?: boolean;
  respectSaveData?: boolean;
  minDownlinkMbps?: number;
}): boolean {
  // @ts-ignore
  const conn = (typeof navigator !== 'undefined') ? navigator.connection : undefined;
  const saveData = conn?.saveData;
  const eff = conn?.effectiveType;
  const down = conn?.downlink;

  if ((opts.respectSaveData ?? true) && saveData) return false;
  if (!(opts.allowOnCellular ?? false) && eff && /2g|3g/.test(eff)) return false;
  if (opts.minDownlinkMbps && down && down < opts.minDownlinkMbps) return false;
  return true;
}
