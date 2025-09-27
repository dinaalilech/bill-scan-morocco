import { Invoice } from '@/types/invoice';

const TOL = 0.10;
const TVA_ALLOWED = [20, 10, 7, 0];

export function validateHeader(inv: Pick<Invoice, 'ice'|'ht'|'tva'|'ttc'|'issueDate'|'currency'>) {
  const warnings: string[] = [];
  // ICE: 15 digits
  if (!/^\d{15}$/.test(inv.ice)) warnings.push('ICE_INVALID');

  // Totals reconciliation
  const sum = Number((inv.ht + inv.tva).toFixed(2));
  if (Math.abs(sum - inv.ttc) > TOL) warnings.push('TOTALS_MISMATCH');

  // Date sanity: not > today + 3d
  const d = new Date(inv.issueDate);
  const now = new Date();
  const plus3 = new Date(now.getTime() + 3 * 86400000);
  if (isNaN(d.getTime()) || d > plus3) warnings.push('DATE_SUSPECT');

  // Currency
  if (!['MAD','EUR','USD'].includes(inv.currency)) warnings.push('CURRENCY_UNKNOWN');

  return warnings;
}

export function clampConfidence(n?: number) {
  if (n === undefined || isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeConfidence(fields: Partial<Record<keyof Invoice, any>>): number {
  // simple weighting for MVP
  let score = 0, w = 0;
  const add = (ok: boolean, weight: number) => { score += (ok ? 100 : 40) * weight; w += weight; };
  add(!!fields.supplier, 1.0);
  add(!!fields.ice && /^\d{15}$/.test(String(fields.ice)), 1.2);
  add(!!fields.issueDate, 0.8);
  add(!!fields.ht, 1.0);
  add(!!fields.tva, 0.8);
  add(!!fields.ttc, 1.0);
  return clampConfidence(score / (w || 1));
}

export { TVA_ALLOWED, TOL };
