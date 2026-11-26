import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DashboardPanel({ id, title, icon: Icon, description, to, children }) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-2xl border border-border-clear2 bg-background-div/95 p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className="shrink-0 text-brand" size={25} aria-hidden="true" />
          <div><h2 id={id} className="text-lg font-bold text-text-primary">{title}</h2>{description && <p className="mt-1 text-xs text-text-secondary">{description}</p>}</div>
        </div>
        {to && <Link to={to} className="inline-flex items-center gap-2 rounded text-xs font-semibold text-text-brand hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring">Ver todas <ArrowRight size={16} aria-hidden="true" /></Link>}
      </div>
      {children}
    </section>
  );
}
