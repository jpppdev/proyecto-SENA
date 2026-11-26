import { CalendarDays } from "lucide-react";
import { indicators, recentOrders, alerts, quickActions } from "../data/dashboard";
import DashboardIndicators from "./DashboardIndicators";
import RecentOrders from "./RecentOrders";
import DashboardAlerts from "./DashboardAlerts";
import QuickActions from "./QuickActions";

export default function AdminHomePage() {
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(today);

  return (
    <div className="min-h-full bg-background-clear/30 text-text-primary">
      <div className="mx-auto max-w-400 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div><h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Panel administrativo</h1><p className="mt-1 text-sm text-text-secondary">Resumen general de la operación del restaurante.</p></div>
          <div className="flex w-fit items-center gap-2 rounded-xl border border-border-clear2 bg-border-clear2/60 px-4 py-3 text-xs text-text-coffee"><CalendarDays size={17} aria-hidden="true" /><time dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`}>Hoy, {dateLabel}</time></div>
        </header>
      
        <DashboardIndicators items={indicators} />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"><RecentOrders orders={recentOrders} /><DashboardAlerts items={alerts} /></div>
        <QuickActions items={quickActions} />
      </div>
    </div>
  );
}
