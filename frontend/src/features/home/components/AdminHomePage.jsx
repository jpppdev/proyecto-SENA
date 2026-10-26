import { BarChart3, CalendarDays, Home, ChevronRight } from "lucide-react";
import { indicators, recentOrders, alerts, quickActions } from "../data/dashboard";
import DashboardIndicators from "./DashboardIndicators";
import RecentOrders from "./RecentOrders";
import DashboardAlerts from "./DashboardAlerts";
import QuickActions from "./QuickActions";

export default function AdminHomePage() {
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(today);

  return (
    <div className="min-h-full bg-[#fdf8f2] text-stone-700">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Ubicación actual" className="flex items-center gap-2 text-xs text-stone-500"><Home size={16} className="text-orange-600" aria-hidden="true" /><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Inicio</span></nav>
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3"><BarChart3 size={36} className="shrink-0 text-orange-600" aria-hidden="true" /><div><h1 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">Panel administrativo</h1><p className="mt-1 text-sm text-stone-500">Resumen general de la operación del restaurante.</p></div></div>
          <div className="flex w-fit items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-900"><CalendarDays size={17} aria-hidden="true" /><time dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`}>Hoy, {dateLabel}</time></div>
        </header>
        <p className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">Vista de demostración: indicadores, órdenes y alertas contienen datos de ejemplo.</p>
        <DashboardIndicators items={indicators} />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"><RecentOrders orders={recentOrders} /><DashboardAlerts items={alerts} /></div>
        <QuickActions items={quickActions} />
      </div>
    </div>
  );
}
