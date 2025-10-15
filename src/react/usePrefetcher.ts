'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundPrefetcher, PrefetchOptions } from '../prefetcher.js';

export function usePrefetcher(opts: PrefetchOptions) {
  const [progress, setProgress] = useState<{done: number, total?: number}>({done:0});
  const [status, setStatus] = useState<'idle'|'started'|'paused'|'resumed'|'completed'|'stopped'|'error'>('idle');
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const errorRef = useRef<any>(null);

  const instance = useMemo(() => {
    const p = new BackgroundPrefetcher({
      ...opts,
      onProgress: (d, t) => setProgress({done: d, total: t}),
      onStatus: async (s, e) => {
        setStatus(s);
        if (s === 'completed') {
          setObjectURL(await p.getObjectURL());
        }
        if (s === 'error') errorRef.current = e;
      }
    });
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.url, opts.cacheKey]);

  useEffect(() => {
    instance.start();
    return () => instance.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance]);

  return { progress, status, objectURL, error: errorRef.current, instance };
}
