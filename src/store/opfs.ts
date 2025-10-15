export type OpfsWriter = {
  writeChunk: (buf: Uint8Array) => Promise<void>;
  seek: (pos: number) => Promise<void>;
  size: () => Promise<number>;
  close: () => Promise<void>;
  toBlob: () => Promise<Blob>;
};

export async function createOpfsWriter(path: string): Promise<OpfsWriter> {
  // @ts-ignore
  if (!(navigator as any)?.storage?.getDirectory) {
    throw new Error('OPFS not supported');
  }
  // @ts-ignore
  const root = await (navigator as any).storage.getDirectory();
  const fileHandle = await root.getFileHandle(path, { create: true });
  const writable = await fileHandle.createWritable({ keepExistingData: true });
  let position = 0;

  return {
    async writeChunk(buf) {
      await writable.write({ type: 'write', position, data: buf });
      position += buf.byteLength;
    },
    async seek(pos) { position = pos; },
    async size() { const f = await fileHandle.getFile(); return f.size; },
    async close() { await writable.close(); },
    async toBlob() { const f = await fileHandle.getFile(); return f; }
  };
}
