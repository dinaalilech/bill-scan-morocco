import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image as ImageIcon, File as FileIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { handleDroppedFiles } from "@/features/intake/handleFiles";

type UIStatus = "queued" | "processing" | "completed" | "error";

type UIFILE = {
  name: string;
  size: string;
  status: UIStatus;
  confidence: number;
  icon: React.ReactNode;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const iconForExt = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="h-5 w-5" />;
  if (ext === "xml") return <FileIcon className="h-5 w-5" />;
  return <ImageIcon className="h-5 w-5" />;
};

const getStatusIcon = (status: UIStatus) => {
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

const UploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UIFILE[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles?.length) return;

    // 1) add to UI as "processing"
    const toAdd: UIFILE[] = acceptedFiles.map((f) => ({
      name: f.name,
      size: formatSize(f.size),
      status: "processing",
      confidence: 0,
      icon: iconForExt(f.name),
    }));
    setUploadedFiles((prev) => [...toAdd, ...prev]);

    // 2) process with your intake → store
    try {
      await handleDroppedFiles(acceptedFiles);
      // 3) mark as completed in UI
      setUploadedFiles((prev) =>
        prev.map((it) =>
          toAdd.find((x) => x.name === it.name) ? { ...it, status: "completed", confidence: 100 } : it
        )
      );
    } catch (e) {
      console.error(e);
      setUploadedFiles((prev) =>
        prev.map((it) =>
          toAdd.find((x) => x.name === it.name) ? { ...it, status: "error", confidence: 0 } : it
        )
      );
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    fileRejections,
    acceptedFiles
  } = useDropzone({
    onDrop,
    noClick: true, // we trigger click via the button
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
      "text/xml": [".xml"],
      "application/xml": [".xml"],
    },
    multiple: true,
    maxSize: 20 * 1024 * 1024, // 20MB per file
  });

  const dropClasses = useMemo(
    () =>
      `border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer ${
        isDragActive ? "border-primary/70" : "border-border hover:border-primary/50"
      }`,
    [isDragActive]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Import de factures</h1>
        <p className="text-muted-foreground">Importez vos factures pour traitement OCR automatique</p>
      </div>

      {/* Upload Zone (Dropzone integrated) */}
      <Card>
        <CardContent className="pt-6">
          <div {...getRootProps({ className: dropClasses })}>
            <input {...getInputProps()} />
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Glissez-déposez vos fichiers ici</h3>
            <p className="text-muted-foreground mb-4">
              Formats supportés: PDF, JPG, PNG, XML (max 20MB par fichier)
            </p>
            <Button className="bg-gradient-primary" onClick={open}>
              Sélectionner des fichiers
            </Button>
          </div>

          {/* (Optional) show rejections */}
          {fileRejections.length > 0 && (
            <p className="mt-3 text-sm text-destructive">Certains fichiers ont été rejetés (type ou taille).</p>
          )}
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
              <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">{file.icon}</div>
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

            {uploadedFiles.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun fichier importé pour le moment.</p>
            )}
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
