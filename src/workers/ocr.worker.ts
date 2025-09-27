/// <reference lib="webworker" />
import Tesseract from "tesseract.js";

type MsgIn = { id: string; blob: ArrayBuffer; langs?: string };
type MsgOut =
  | { id: string; ok: true; text: string }
  | { id: string; ok: false; error: string };

self.addEventListener("message", async (e: MessageEvent<MsgIn>) => {
  const { id, blob, langs = "eng+fra" } = e.data;
  try {
    const img = new Blob([blob]);
    // Cast to any to avoid strict typings issues across tesseract versions
    const res: any = await (Tesseract as any).recognize(img, langs);
    const text: string = res?.data?.text ?? "";
    (self as unknown as Worker).postMessage({ id, ok: true, text } as MsgOut);
  } catch (err: any) {
    (self as unknown as Worker).postMessage({
      id,
      ok: false,
      error: err?.message ?? "OCR_ERROR",
    } as MsgOut);
  }
});
