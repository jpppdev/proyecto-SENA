import { ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";

const statusStyles = {
  preparing: "bg-brand-soft/40 text-text-brand",
  pending: "bg-amber-100 text-amber-800",
  served: "bg-emerald-100 text-emerald-800",
};

export default function RecentOrders({ orders, error }) {
  return (
    <DashboardPanel id="recent-orders-title" title="Órdenes recientes" icon={ReceiptText} to="/dashboard/orderList">
      {orders?.length ? (
        <div className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-focus-ring" tabIndex={0} role="region" aria-label="Tabla de órdenes recientes">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-background-clear/60 text-xs text-text-coffee">
              <tr>{["# Orden", "Mesa", "Mesero", "Estado", "Hora"].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border-clear2 last:border-0">
                  <th scope="row" className="px-3 py-4 font-semibold text-text-brand">
                    <Link to={`/dashboard/orderView/${order.id}`} className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring">#{order.id}</Link>
                  </th>
                  <td className="px-3 py-4">{Number(order.table) > 0 ? `Mesa ${order.table}` : "Sin mesa"}</td>
                  <td className="px-3 py-4">{order.waiter || "Sin asignar"}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.stage] || "bg-brand-light text-text-secondary"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{order.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-text-muted">{order.time || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p role="status" className="text-sm text-text-secondary">
          {error ? "Las órdenes recientes no están disponibles." : orders ? "Todavía no hay órdenes registradas." : "Cargando órdenes recientes…"}
        </p>
      )}
    </DashboardPanel>
  );
}
