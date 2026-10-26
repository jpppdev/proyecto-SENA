import { ArrowUp, ArrowDown } from "lucide-react";
import DashboardIcon from "./DashboardIcon";

export default function DashboardIndicators({ items }) {
  return (
    <section aria-label="Indicadores principales de demostración" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, change, icon, tone, rising }) => {
        const Arrow = rising ? ArrowUp : ArrowDown;
        return (
          <article key={label} className="rounded-2xl border border-orange-100 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <DashboardIcon name={icon} tone={tone} />
              <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold text-stone-600">{label}</h2><div className="mt-1 flex items-center justify-between gap-3"><strong className="text-3xl font-bold text-stone-800">{value}</strong><span className="text-right text-xs"><span className={`flex items-center justify-end font-bold ${tone === "red" ? "text-red-600" : "text-emerald-700"}`}><Arrow size={14} aria-hidden="true" />{change}</span><span className="text-stone-500">vs. ayer</span></span></div></div>
            </div>
            <svg viewBox="0 0 140 26" className={`mt-3 h-5 w-28 fill-none ${tone === "red" ? "text-red-400" : "text-orange-400"}`} aria-hidden="true"><path d="M2 20C15 20 18 6 29 9s17 17 30 10 16-13 28-8 20 10 28 1 16-8 23-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </article>
        );
      })}
    </section>
  );
}
