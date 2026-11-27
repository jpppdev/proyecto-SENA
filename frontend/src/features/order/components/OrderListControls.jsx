import { Button } from "@/shared";
import { matchesOrderFilter, numberFormat, orderFilters, orderStates } from "../data/orderList";

export function OrderStatistics({ orders }) {
  const counts = orders?.reduce((result, { stage }) => {
    result[stage] = (result[stage] ?? 0) + 1;
    return result;
  }, {});

  return (
    <section aria-label="Estadísticas de órdenes" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {Object.entries(orderStates).filter(([, state]) => state.plural).map(([id, state]) => (
        <div key={id} className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center sm:rounded-3xl sm:py-4 ${state.style}`}>
          <strong className="text-title leading-none font-heading tabular-nums sm:text-main">{counts ? numberFormat.format(counts[id] ?? 0) : "—"}</strong>
          <span className="text-medium sm:text-body">{state.plural}</span>
        </div>
      ))}
    </section>
  );
}

export function OrderFilters({ orders, filter, onChange }) {
  return (
    <div role="group" aria-label="Filtrar órdenes" className="grid grid-cols-2 gap-1 rounded-2xl bg-background-clear/55 p-1 sm:grid-cols-3 xl:grid-cols-6 xl:rounded-full [.dark_&]:bg-background-inverse">
      {orderFilters.map(({ id, label }) => {
        const count = orders?.filter((order) => matchesOrderFilter(order, id)).length;
        const selected = filter === id;
        return (
          <Button
            key={id}
            aria-pressed={selected}
            onClick={() => onChange(id)}
            className={`min-h-10 cursor-pointer rounded-full px-2 py-1 text-medium font-medium-custom transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring ${selected ? "bg-brand-hover text-text-inverse shadow-sm" : "hover:bg-brand-soft/30"}`}
          >
            {label}{count != null && ` (${numberFormat.format(count)})`}
          </Button>
        );
      })}
    </div>
  );
}
