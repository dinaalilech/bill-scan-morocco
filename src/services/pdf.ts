// src/services/pdf.ts
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist";
// Vite: import worker file URL for pdf.js
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export async function pdfToImageBlobs(file: File, scale = 2): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
  const blobs: Blob[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 👇 v4 requires `canvas`
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b as Blob), "image/png", 0.92)
    );
    blobs.push(blob);
  }

  return blobs;
}
