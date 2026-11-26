import { Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import DashboardIcon from "./DashboardIcon";

export default function QuickActions({ items }) {
  return (
    <DashboardPanel id="quick-actions-title" title="Accesos rápidos" icon={Zap} description="Accede rápidamente a las funciones más utilizadas del sistema.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{items.map(item => <Link key={item.to} to={item.to} className="group rounded-xl border border-border-clear2 bg-background-clear/40 p-4 transition-colors hover:border-border-hover hover:bg-background-clear/70 focus-visible:outline-2 focus-visible:outline-focus-ring"><div className="mb-3 flex items-center justify-between"><DashboardIcon name={item.icon} /><ChevronRight size={20} className="text-brand" aria-hidden="true" /></div><h3 className="text-sm font-bold text-text-primary group-hover:text-text-brand">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-text-secondary">{item.description}</p></Link>)}</div>
    </DashboardPanel>
  );
}
