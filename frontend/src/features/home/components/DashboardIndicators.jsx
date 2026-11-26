import DashboardIcon from "./DashboardIcon";

export default function DashboardIndicators({ items }) {
  return (
    <section aria-label="Indicadores principales de demostración" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon, tone }) => {
        return (
          <article key={label} className="rounded-2xl border border-border-clear2 bg-background-div/95 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <DashboardIcon name={icon} tone={tone} />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-text-secondary">{label}</h2>
                <div className="mt-1">
                  <strong className="text-3xl font-bold text-text-primary">{value}</strong>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
