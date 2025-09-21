import { Upload, FileText, Image, File, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const UploadPage = () => {
  const uploadedFiles = [
    {
      name: "facture_001.pdf",
      size: "2.4 MB",
      status: "completed",
      confidence: 98,
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "facture_002.jpg",
      size: "1.8 MB", 
      status: "processing",
      confidence: 0,
      icon: <Image className="h-5 w-5" />
    },
    {
      name: "facture_003.xml",
      size: "156 KB",
      status: "error",
      confidence: 0,
      icon: <File className="h-5 w-5" />
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "processing":
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Import de factures</h1>
        <p className="text-muted-foreground">
          Importez vos factures pour traitement OCR automatique
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Glissez-déposez vos fichiers ici</h3>
            <p className="text-muted-foreground mb-4">
              Formats supportés: PDF, JPG, PNG, XML (max 10MB par fichier)
            </p>
            <Button className="bg-gradient-primary">
              Sélectionner des fichiers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fichiers en cours de traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {file.icon}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {file.status === "processing" && (
                    <div className="w-24">
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                  
                  {file.status === "completed" && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">
                        {file.confidence}% confiance
                      </p>
                    </div>
                  )}
                  
                  {file.status === "error" && (
                    <div className="text-right">
                      <p className="text-sm text-destructive">Erreur OCR</p>
                    </div>
                  )}
                  
                  {getStatusIcon(file.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour un meilleur traitement OCR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Qualité des images</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Résolution minimale: 300 DPI</li>
                <li>• Éviter les images floues</li>
                <li>• Bon éclairage et contraste</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Formats recommandés</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF natifs (texte sélectionnable)</li>
                <li>• JPG/PNG haute qualité</li>
                <li>• XML structurés UBL/CII</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;