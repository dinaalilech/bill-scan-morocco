import { Invoice } from '@/types/invoice';
import * as XLSX from 'xlsx';

function two(n: number) { return Number(n.toFixed(2)); }
function fmtDate(iso: string) {
  const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`;
}

export function exportCSV(invoices: Invoice[]) {
  const rows: string[] = [];
  const head = [
    'invoice_id','ref','supplier','ice','issue_date','currency','ht','tva','ttc','status','confidence',
    'source_kind','original_name','line_id','designation','qty','unit_price','tva_rate','line_total'
  ];
  rows.push(head.join(','));
  invoices.forEach((inv) => {
    if (!inv.items.length) {
      rows.push([
        inv.id, inv.ref ?? '', inv.supplier, inv.ice, fmtDate(inv.issueDate), inv.currency,
        two(inv.ht), two(inv.tva), two(inv.ttc), inv.status, inv.confidence,
        inv.source.kind, inv.source.originalName, '', '', '', '', '', ''
      ].join(','));
    } else {
      inv.items.forEach((ln) => {
        rows.push([
          inv.id, inv.ref ?? '', inv.supplier, inv.ice, fmtDate(inv.issueDate), inv.currency,
          two(inv.ht), two(inv.tva), two(inv.ttc), inv.status, inv.confidence,
          inv.source.kind, inv.source.originalName,
          ln.id, ln.designation, ln.qty, ln.unitPrice, ln.tvaRate, two(ln.lineTotal)
        ].join(','));
      });
    }
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `export-${ts()}.csv`);
}

export function exportXLSX(invoices: Invoice[]) {
  const invoicesSheet = invoices.map((inv) => ({
    invoice_id: inv.id,
    ref: inv.ref ?? '',
    supplier: inv.supplier,
    ice: inv.ice,
    issue_date: fmtDate(inv.issueDate),
    currency: inv.currency,
    ht: two(inv.ht),
    tva: two(inv.tva),
    ttc: two(inv.ttc),
    status: inv.status,
    confidence: inv.confidence,
    source_kind: inv.source.kind,
    original_name: inv.source.originalName
  }));
  const linesSheet = invoices.flatMap((inv) =>
    inv.items.map((ln) => ({
      line_id: ln.id,
      invoice_id: inv.id,
      designation: ln.designation,
      qty: ln.qty,
      unit_price: ln.unitPrice,
      tva_rate: ln.tvaRate,
      line_total: two(ln.lineTotal),
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invoicesSheet), 'Invoices');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(linesSheet), 'Lines');
  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, `export-${ts()}.xlsx`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function ts() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
