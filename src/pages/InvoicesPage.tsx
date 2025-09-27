import React from "react";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { exportCSV, exportXLSX } from "@/services/export";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const fmtMoney = (value: number, currency: "MAD" | "EUR" | "USD") => {
  if (value === undefined || value === null) return "—";
  try {
    return new Intl.NumberFormat("fr-MA", { style: "currency", currency }).format(value);
  } catch {
    // fallback if currency code is odd
    return `${value.toFixed(2)} ${currency}`;
  }
};

const StatusBadge: React.FC<{ status: "new" | "needs_review" | "validated" | "error" }> = ({ status }) => {
  switch (status) {
    case "validated":
      return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600/90">Validée</Badge>;
    case "needs_review":
      return <Badge variant="secondary">À vérifier</Badge>;
    case "error":
      return <Badge variant="destructive">Erreur</Badge>;
    default:
      return <Badge variant="outline">Nouvelle</Badge>;
  }
};

const InvoicesPage: React.FC = () => {
  const invoices = useInvoiceStore((s) => s.invoices);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Factures</h1>
          <p className="text-muted-foreground">
            Liste des factures importées et traitées (local au navigateur).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={invoices.length === 0}
            onClick={() => exportCSV(invoices)}
          >
            Export CSV
          </Button>
          <Button
            className="bg-gradient-primary"
            disabled={invoices.length === 0}
            onClick={() => exportXLSX(invoices)}
          >
            Export XLSX
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tableau des factures</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune facture pour le moment. Allez à <strong>Import de factures</strong> pour déposer vos fichiers.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Référence</TableHead>
                    <TableHead className="min-w-[220px]">Fournisseur</TableHead>
                    <TableHead>ICE</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead className="text-right">HT</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">TTC</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Confiance</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.ref ?? "—"}</TableCell>
                      <TableCell>{inv.supplier || "—"}</TableCell>
                      <TableCell>{inv.ice || "—"}</TableCell>
                      <TableCell>{fmtDate(inv.issueDate)}</TableCell>
                      <TableCell>{inv.currency}</TableCell>
                      <TableCell className="text-right">{fmtMoney(inv.ht, inv.currency)}</TableCell>
                      <TableCell className="text-right">{fmtMoney(inv.tva, inv.currency)}</TableCell>
                      <TableCell className="text-right">{fmtMoney(inv.ttc, inv.currency)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell>{inv.confidence}%</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {inv.source.kind.toUpperCase()} · {inv.source.originalName}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
