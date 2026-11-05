import { Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import DashboardIcon from "./DashboardIcon";

export default function QuickActions({ items }) {
  return (
    <DashboardPanel id="quick-actions-title" title="Accesos rápidos" icon={Zap} description="Accede rápidamente a las funciones más utilizadas del sistema.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{items.map(item => <Link key={item.to} to={item.to} className="group rounded-xl border border-orange-100 bg-orange-50/40 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-600"><div className="mb-3 flex items-center justify-between"><DashboardIcon name={item.icon} /><ChevronRight size={20} className="text-orange-500" aria-hidden="true" /></div><h3 className="text-sm font-bold text-stone-800 group-hover:text-orange-700">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-stone-500">{item.description}</p></Link>)}</div>
    </DashboardPanel>
  );
}
