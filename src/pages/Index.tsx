import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { QuickActions } from "@/components/upload/QuickActions";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos factures et activités de traitement OCR
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        
        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Recent Invoices */}
      <RecentInvoices />
    </div>
  );
};

export default Index;
