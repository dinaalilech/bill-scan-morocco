import { Upload, Camera, FileText, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    {
      title: "Importer des factures",
      description: "PDF, JPG, PNG ou XML",
      icon: <Upload className="h-6 w-6" />,
      action: "upload",
      primary: true
    },
    {
      title: "Capture mobile",
      description: "Photographier une facture",
      icon: <Smartphone className="h-6 w-6" />,
      action: "mobile",
      primary: false
    },
    {
      title: "Traitement par lot",
      description: "Plusieurs fichiers simultanément",
      icon: <FileText className="h-6 w-6" />,
      action: "batch",
      primary: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Button
              key={action.action}
              variant={action.primary ? "default" : "outline"}
              className={`h-auto p-4 justify-start gap-4 ${action.primary ? 'bg-gradient-primary border-0' : ''}`}
            >
              <div className={`p-2 rounded-lg ${action.primary ? 'bg-white/20' : 'bg-primary/10'}`}>
                {action.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className={`text-sm ${action.primary ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}