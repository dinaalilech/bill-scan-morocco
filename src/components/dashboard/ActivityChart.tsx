import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function ActivityChart() {
  // Simulation d'un graphique avec des barres CSS
  const weekData = [
    { day: "Lun", invoices: 45, height: "60%" },
    { day: "Mar", invoices: 32, height: "40%" },
    { day: "Mer", invoices: 78, height: "100%" },
    { day: "Jeu", invoices: 56, height: "75%" },
    { day: "Ven", invoices: 89, height: "90%" },
    { day: "Sam", invoices: 23, height: "30%" },
    { day: "Dim", invoices: 12, height: "15%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Activité cette semaine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="h-32 flex items-end justify-between gap-2">
            {weekData.map((data) => (
              <div key={data.day} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-primary rounded-t-sm relative"
                  style={{ height: data.height }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground">
                    {data.invoices}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
          
          {/* Chart Legend */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-primary rounded"></div>
                <span className="text-muted-foreground">Factures traitées</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">335 factures</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}