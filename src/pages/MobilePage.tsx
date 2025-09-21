import { Camera, Smartphone, CheckCircle, Upload, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MobilePage = () => {
  const recentCaptures = [
    {
      id: "1",
      name: "Facture Restaurant Atlas",
      date: "Il y a 5 min",
      status: "processed",
      amount: "145.00 MAD"
    },
    {
      id: "2", 
      name: "Facture Carburant Shell",
      date: "Il y a 2h",
      status: "processing",
      amount: "--"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <Smartphone className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Capture mobile</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Prenez une photo de votre facture pour traitement OCR instantané
        </p>
      </div>

      {/* Mobile Simulation */}
      <div className="max-w-sm mx-auto">
        <Card className="bg-gradient-muted">
          <CardContent className="p-6">
            {/* Camera View Simulation */}
            <div className="aspect-[3/4] bg-muted/50 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center mb-6">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Positionnez la facture dans le cadre
              </p>
            </div>

            {/* Capture Button */}
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary text-white font-semibold py-4"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capturer la facture
            </Button>

            {/* Tips */}
            <div className="mt-4 p-3 bg-accent-light rounded-lg">
              <p className="text-sm font-medium text-accent-foreground">💡 Conseil</p>
              <p className="text-xs text-accent-foreground/80 mt-1">
                Assurez-vous que le texte est lisible et que la facture est bien éclairée
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium">1. Photographiez</h4>
              <p className="text-sm text-muted-foreground">
                Prenez une photo claire de votre facture
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-medium">2. Envoyez</h4>
              <p className="text-sm text-muted-foreground">
                L'image est automatiquement envoyée pour traitement
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-medium">3. Validez</h4>
              <p className="text-sm text-muted-foreground">
                Vérifiez et corrigez les données extraites si nécessaire
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Captures */}
      <Card>
        <CardHeader>
          <CardTitle>Captures récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCaptures.map((capture) => (
              <div key={capture.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{capture.name}</p>
                    <p className="text-xs text-muted-foreground">{capture.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  {capture.status === "processed" ? (
                    <div>
                      <p className="font-semibold text-sm">{capture.amount}</p>
                      <CheckCircle className="h-4 w-4 text-success inline" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePage;