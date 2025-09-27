export type Currency = 'MAD' | 'EUR' | 'USD';
export type Status = 'new' | 'needs_review' | 'validated' | 'error';

export type LineItem = {
  id: string;
  invoiceId: string;
  designation: string;
  qty: number;
  unitPrice: number;     // HT
  tvaRate: number;       // e.g. 20, 10, 7, 0
  lineTotal: number;     // HT total
  confidence: number;    // 0-100
};

export type SourceMeta = {
  kind: 'image' | 'pdf' | 'xml';
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  pages?: number;
  batchId?: string;
  ingestedAt: string;    // ISO
};

export type Invoice = {
  id: string;
  ref?: string;
  supplier: string;
  ice: string;           // 15 digits
  if?: string;           // optional 8 digits
  issueDate: string;     // ISO YYYY-MM-DD
  currency: Currency;    // default MAD
  ht: number;
  tva: number;
  ttc: number;
  status: Status;
  confidence: number;    // 0-100
  warnings?: string[];   // codes like MISSING_IF, TOTALS_MISMATCH
  items: LineItem[];
  source: SourceMeta;
  createdAt: string;     // ISO
  updatedAt: string;     // ISO
};
