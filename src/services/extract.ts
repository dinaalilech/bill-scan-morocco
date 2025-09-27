export type PartialHeader = {
  supplier?: string;
  ice?: string;
  if?: string;
  issueDate?: string;     // ISO
  currency?: 'MAD' | 'EUR' | 'USD';
  ht?: number;
  tva?: number;
  ttc?: number;
  ref?: string;
};

const ICE_RE = /\b\d{15}\b/;
const IF_RE  = /\b\d{8}\b/;
const DATE_RE = /\b(\d{2})[\/.\-](\d{2})[\/.\-](\d{4})\b|\b(\d{4})[\/.\-](\d{2})[\/.\-](\d{2})\b/;
const CUR_RE = /\b(MAD|DHS?|EUR|USD)\b/i;
const NUM_RE = /-?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{1,4})?/;

function toNumber(s?: string): number | undefined {
  if (!s) return;
  const n = s.replace(/\s/g, '').replace(',', '.');
  const m = n.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : undefined;
}
function normDate(d: string): string | undefined {
  // dd/mm/yyyy or yyyy-mm-dd → yyyy-mm-dd
  const m1 = d.match(/^(\d{2})[\/.\-](\d{2})[\/.\-](\d{4})$/);
  if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
  const m2 = d.match(/^(\d{4})[\/.\-](\d{2})[\/.\-](\d{2})$/);
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return;
}

export function extractHeaderFromText(text: string): PartialHeader {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const joined = lines.join(' ');
  const out: PartialHeader = {};

  const ice = joined.match(ICE_RE)?.[0];
  if (ice) out.ice = ice;

  const ifn = joined.match(IF_RE)?.[0];
  if (ifn) out.if = ifn;

  const dateMatch = joined.match(DATE_RE);
  if (dateMatch) {
    const raw = dateMatch[0];
    const iso = normDate(raw);
    if (iso) out.issueDate = iso;
  }

  const cur = joined.match(CUR_RE)?.[0]?.toUpperCase();
  if (cur) out.currency = cur === 'DH' || cur === 'DHS' ? 'MAD' : (cur as any);
  else out.currency = 'MAD';

  // Totals: search for lines containing HT/TVA/TTC
  for (const l of lines) {
    if (/HT\b/i.test(l)) {
      const n = l.match(NUM_RE)?.[0];
      const v = toNumber(n);
      if (v !== undefined) out.ht = v;
    }
    if (/TVA\b/i.test(l)) {
      const n = l.match(NUM_RE)?.[0];
      const v = toNumber(n);
      if (v !== undefined) out.tva = v;
    }
    if (/(TTC|T\.T\.C|TOTAL TTC)/i.test(l)) {
      const n = l.match(NUM_RE)?.[0];
      const v = toNumber(n);
      if (v !== undefined) out.ttc = v;
    }
  }

  // crude supplier guess: first big uppercase-ish line
  const candidate = lines.find((l) => l === l.toUpperCase() && l.length >= 5);
  if (candidate) out.supplier = candidate;

  // crude ref guess
  const refLine = lines.find((l) => /Facture|Invoice|N°|No|Num/i.test(l));
  if (refLine) {
    const token = refLine.split(/[:\s]/).find((t) => /\w{4,}/.test(t));
    if (token) out.ref = token.toUpperCase();
  }

  return out;
}
