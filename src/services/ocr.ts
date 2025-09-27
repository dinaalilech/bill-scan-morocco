let _worker: Worker | null = null;
const getWorker = () => {
  if (_worker) return _worker;
  _worker = new Worker(new URL('@/workers/ocr.worker.ts', import.meta.url), { type: 'module' });
  return _worker;
};

export function ocrBlob(blob: Blob, langs = 'eng+fra'): Promise<{ text: string }> {
  const worker = getWorker();
  const id = Math.random().toString(36).slice(2);
  return new Promise((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.id !== id) return;
      worker.removeEventListener('message', onMessage);
      if (e.data.ok) resolve({ text: e.data.text as string });
      else reject(new Error(e.data.error));
    };
    worker.addEventListener('message', onMessage);
    blob.arrayBuffer().then((ab) => worker.postMessage({ id, blob: ab, langs }));
  });
}
