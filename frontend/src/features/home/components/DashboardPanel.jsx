import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DashboardPanel({ id, title, icon: Icon, description, to, children }) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className="shrink-0 text-orange-600" size={25} aria-hidden="true" />
          <div><h2 id={id} className="text-lg font-bold text-stone-800">{title}</h2>{description && <p className="mt-1 text-xs text-stone-500">{description}</p>}</div>
        </div>
        {to && <Link to={to} className="inline-flex items-center gap-2 rounded text-xs font-semibold text-orange-700 hover:underline focus-visible:outline-2 focus-visible:outline-orange-600">Ver todas <ArrowRight size={16} aria-hidden="true" /></Link>}
      </div>
      {children}
    </section>
  );
}
