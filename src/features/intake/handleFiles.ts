import { Invoice, LineItem } from '@/types/invoice';
import { pdfToImageBlobs } from '@/services/pdf';
import { ocrBlob } from '@/services/ocr';
import { extractHeaderFromText } from '@/services/extract';
import { validateHeader, computeConfidence } from '@/services/validate';
import { useInvoiceStore } from '@/stores/invoiceStore';

const uuid = () => crypto.randomUUID();

async function imageToHeader(blob: Blob) {
  const { text } = await ocrBlob(blob, 'eng+fra');
  return extractHeaderFromText(text);
}

function makeInvoiceBase(file: File, kind: 'image'|'pdf'|'xml'): Pick<Invoice, 'id'|'source'|'status'|'confidence'|'createdAt'|'updatedAt'> {
  return {
    id: uuid(),
    status: 'new',
    confidence: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: {
      kind,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      ingestedAt: new Date().toISOString()
    }
  };
}

export async function handleDroppedFiles(files: File[]) {
  const pushes: Invoice[] = [];

  for (const file of files) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();

    // XML
    if (ext === 'xml' || file.type === 'text/xml' || file.type === 'application/xml') {
      const base = makeInvoiceBase(file, 'xml');
      const text = await file.text();
      // simple XML extraction (header only for MVP)
      const header = extractHeaderFromText(text); // fallback using regex if UBL tags vary
      const inv = finalize(header, base);
      pushes.push(inv);
      continue;
    }

    // PDF
    if (ext === 'pdf' || file.type === 'application/pdf') {
      const base = makeInvoiceBase(file, 'pdf');
      const blobs = await pdfToImageBlobs(file, 2);
      base.source.pages = blobs.length;
      let aggText = '';
      for (const b of blobs) {
        const { text } = await ocrBlob(b, 'eng+fra');
        aggText += '\n' + text;
      }
      const header = extractHeaderFromText(aggText);
      const inv = finalize(header, base);
      pushes.push(inv);
      continue;
    }

    // Image (jpg/png)
    if (/^image\//.test(file.type)) {
      const base = makeInvoiceBase(file, 'image');
      const header = await imageToHeader(file);
      const inv = finalize(header, base);
      pushes.push(inv);
      continue;
    }

    // Unsupported → skip silently for MVP
    console.warn('Unsupported file:', file.name, file.type);
  }

  if (pushes.length) useInvoiceStore.getState().addInvoices(pushes);
}

function finalize(header: any, base: ReturnType<typeof makeInvoiceBase>): Invoice {
  // normalize header with defaults
  const supplier = header.supplier ?? '—';
  const ice = header.ice ?? '000000000000000';
  const issueDate = header.issueDate ?? new Date().toISOString().slice(0,10);
  const currency = header.currency ?? 'MAD';
  const ht = Number((header.ht ?? 0).toFixed?.(2) ?? header.ht ?? 0);
  const tva = Number((header.tva ?? 0).toFixed?.(2) ?? header.tva ?? 0);
  const ttc = Number((header.ttc ?? ht + tva).toFixed?.(2) ?? header.ttc ?? (ht + tva));
  const warnings = validateHeader({ ice, ht, tva, ttc, issueDate, currency });
  const confidence = computeConfidence({ supplier, ice, issueDate, ht, tva, ttc });

  const inv: Invoice = {
    id: base.id,
    ref: header.ref,
    supplier,
    ice,
    if: header.if,
    issueDate,
    currency,
    ht, tva, ttc,
    status: warnings.length ? 'needs_review' : 'validated',
    confidence,
    warnings,
    items: [],
    source: base.source,
    createdAt: base.createdAt,
    updatedAt: new Date().toISOString(),
  };
  return inv;
}
