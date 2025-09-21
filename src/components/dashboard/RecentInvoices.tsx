import { FileText, Eye, Download, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
  id: string;
  reference: string;
  company: string;
  date: string;
  amount: string;
  status: "validated" | "pending" | "error";
  confidence: number;
}

function getStatusBadge(status: Invoice["status"]) {
  switch (status) {
    case "validated":
      return <Badge variant="outline" className="text-success border-success/20 bg-success/10">Validée</Badge>;
    case "pending":
      return <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">En attente</Badge>;
    case "error":
      return <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10">Erreur</Badge>;
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 90) return "text-success";
  if (confidence >= 70) return "text-warning";
  return "text-destructive";
}

export function RecentInvoices() {
  const invoices: Invoice[] = [
    {
      id: "1",
      reference: "INV-2024-001",
      company: "Société ATLAS SARL",
      date: "2024-01-15",
      amount: "12,450.00 MAD",
      status: "validated",
      confidence: 98
    },
    {
      id: "2",
      reference: "INV-2024-002",
      company: "Entreprise HASSAN & FILS",
      date: "2024-01-15",
      amount: "7,890.50 MAD",
      status: "pending",
      confidence: 85
    },
    {
      id: "3",
      reference: "INV-2024-003",
      company: "MAROC IMPORT EXPORT",
      date: "2024-01-14",
      amount: "25,670.00 MAD",
      status: "validated",
      confidence: 96
    },
    {
      id: "4",
      reference: "INV-2024-004",
      company: "CONSTRUCTIONS MODERNES",
      date: "2024-01-14",
      amount: "45,200.75 MAD",
      status: "error",
      confidence: 65
    },
    {
      id: "5",
      reference: "INV-2024-005",
      company: "TECH SOLUTIONS MAROC",
      date: "2024-01-13",
      amount: "8,320.00 MAD",
      status: "validated",
      confidence: 94
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Factures récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{invoice.reference}</p>
                  <p className="text-sm text-muted-foreground">{invoice.company}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                    <span className={`text-xs font-medium ${getConfidenceColor(invoice.confidence)}`}>
                      {invoice.confidence}% confiance
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold">{invoice.amount}</p>
                  {getStatusBadge(invoice.status)}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualiser
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="w-full">
            Voir toutes les factures
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}