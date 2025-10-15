const DB_NAME = 'bg-prefetch-idb';
const STORE = 'parts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: ['key', 'start'] });
      }
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export async function idbAppend(key: string, start: number, blob: Blob) {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ key, start, blob });
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}

export async function idbAssemble(key: string): Promise<Blob | null> {
  const db = await openDB();
  const parts: { start: number; blob: Blob }[] = await new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const all = (req.result as any[]).filter(r => r.key === key).map(r => ({ start: r.start, blob: r.blob }));
      res(all);
    };
    req.onerror = () => rej(req.error);
  });
  db.close();
  if (!parts.length) return null;
  parts.sort((a, b) => a.start - b.start);
  return new Blob(parts.map(p => p.blob));
}

export async function idbPurge(key: string) {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.getAllKeys();
    req.onsuccess = () => {
      const keys = req.result as [string, number][];
      keys.filter(k => k[0] === key).forEach(k => store.delete(k));
    };
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}
