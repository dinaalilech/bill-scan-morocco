import { FileText, Search, Filter, Eye, Download, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvoicesPage = () => {
  const invoices = [
    {
      id: "1",
      reference: "INV-2024-001",
      company: "Société ATLAS SARL",
      date: "2024-01-15",
      amount: "12,450.00 MAD",
      status: "validated",
      confidence: 98,
      type: "PDF"
    },
    {
      id: "2",
      reference: "INV-2024-002",
      company: "Entreprise HASSAN & FILS",
      date: "2024-01-15",
      amount: "7,890.50 MAD",
      status: "pending",
      confidence: 85,
      type: "Image"
    },
    {
      id: "3",
      reference: "INV-2024-003",
      company: "MAROC IMPORT EXPORT",
      date: "2024-01-14",
      amount: "25,670.00 MAD",
      status: "validated",
      confidence: 96,
      type: "XML"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-success/10 text-success border-success/20">Validée</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">En attente</Badge>;
      case "error":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Erreur</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes factures</h1>
          <p className="text-muted-foreground">
            Gestion et visualisation de toutes vos factures traitées
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <FileText className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence, entreprise..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{invoice.reference}</p>
                      <Badge variant="outline" className="text-xs">
                        {invoice.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.company}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{invoice.date}</span>
                      <span className="text-primary font-medium">
                        {invoice.confidence}% confiance OCR
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{invoice.amount}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;