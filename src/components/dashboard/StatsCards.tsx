import { TrendingUp, TrendingDown, FileText, CheckCircle, AlertTriangle, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, change, trend, icon, description }: StatCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <Card className="hover:shadow-medium transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          {TrendIcon && <TrendIcon className={`h-3 w-3 ${trendColor}`} />}
          <span className={trendColor}>{change}</span>
          <span className="text-muted-foreground">vs mois dernier</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: "Factures traitées",
      value: "1,247",
      change: "+12.5%",
      trend: "up" as const,
      icon: <FileText className="h-4 w-4" />,
      description: "Total factures OCR"
    },
    {
      title: "Conformes DGI",
      value: "1,189",
      change: "+8.2%",
      trend: "up" as const,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "95.3% de conformité"
    },
    {
      title: "En attente validation",
      value: "42",
      change: "-15.3%",
      trend: "down" as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Correction manuelle requise"
    },
    {
      title: "Montant total TTC",
      value: "487,234 MAD",
      change: "+22.1%",
      trend: "up" as const,
      icon: <Euro className="h-4 w-4" />,
      description: "TVA incluse"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}