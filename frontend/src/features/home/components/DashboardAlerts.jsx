import { Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import DashboardIcon from "./DashboardIcon";

export default function DashboardAlerts({ items }) {
  return (
    <DashboardPanel id="dashboard-alerts-title" title="Alertas" icon={Bell}>
      <ul className="space-y-2">{items.map(item => <li key={item.title}><Link to={item.to} className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-background-clear/60 focus-visible:outline-2 focus-visible:outline-focus-ring ${item.tone === "red" ? "bg-red-50" : "bg-brand-light/50"}`}><DashboardIcon name={item.icon} tone={item.tone} /><div className="min-w-0 flex-1"><h3 className={`text-sm font-bold ${item.tone === "red" ? "text-red-700" : "text-text-primary"}`}>{item.title}</h3><p className="mt-0.5 text-xs text-text-secondary">{item.description}</p><p className="mt-1 text-xs text-text-muted">{item.time}</p></div><ChevronRight className="shrink-0 text-brand" size={18} aria-hidden="true" /></Link></li>)}</ul>
    </DashboardPanel>
  );
}
