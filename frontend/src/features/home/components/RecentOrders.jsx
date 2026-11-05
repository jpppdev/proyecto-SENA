import { ReceiptText } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const statusStyles = { "En preparación": "bg-orange-100 text-orange-700", Pendiente: "bg-amber-100 text-amber-800", Servida: "bg-emerald-100 text-emerald-800" };

export default function RecentOrders({ orders }) {
  return (
    <DashboardPanel id="recent-orders-title" title="Órdenes recientes" icon={ReceiptText} to="/dashboard/orderList">
      <div className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-orange-600" tabIndex={0} role="region" aria-label="Tabla de órdenes recientes">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="bg-orange-50 text-xs text-stone-600"><tr>{["# Orden", "Mesa", "Mesero", "Estado", "Hora"].map(label => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
          <tbody>{orders.map(order => <tr key={order.id} className="border-b border-orange-50 last:border-0"><th scope="row" className="px-3 py-4 font-semibold text-orange-700">#{order.id}</th><td className="px-3 py-4">Mesa {order.table}</td><td className="px-3 py-4">{order.waiter}</td><td className="px-3 py-4"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-stone-100 text-stone-700"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{order.status}</span></td><td className="px-3 py-4 text-stone-500">{order.time}</td></tr>)}</tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}
