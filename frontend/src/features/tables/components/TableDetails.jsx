import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Armchair, Check, FileText, Pencil } from "lucide-react";
import { Button, Select } from "@/shared";
import { getOrderById } from "@/features/order/services/orderServices";
import restaurant from "@/assets/images/Img-Restaurante.jpeg";
import TableStatus from "./TableStatus";
import { formatMoney, panelClass, secondaryText } from "./tableStyles";

function TableOrderSummary({ orderId, menuImages }) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getOrderById(orderId)
      .then((order) => { if (active) setResult({ order }); })
      .catch((error) => { if (active) setResult({ error: error.message }); });
    return () => { active = false; };
  }, [orderId, attempt]);

  if (!result) return <p role="status">Cargando pedido…</p>;
  if (result.error) return (
    <div className="space-y-2">
      <p role="alert">{result.error}</p>
      <Button size="sm" onClick={() => { setResult(null); setAttempt(attempt + 1); }}>Reintentar</Button>
    </div>
  );

  const { order } = result;
  return (
    <div className="overflow-hidden rounded-xl border border-border-clear2">
      {order.dishes?.length ? (
        <ul className="divide-y divide-border-clear2">
          {order.dishes.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-2.5">
              {menuImages.get(String(item.productId)) && (
                <img src={menuImages.get(String(item.productId))} alt="" loading="lazy" className="size-12 rounded-lg object-cover" />
              )}
              <div className="mr-auto min-w-0">
                <p className="font-medium-custom">{item.name}</p>
                <p className={`text-medium ${secondaryText}`}>{item.quantity} × {formatMoney(item.price)}</p>
              </div>
              <p className="shrink-0 font-medium-custom">{formatMoney(item.quantity * item.price)}</p>
            </li>
          ))}
        </ul>
      ) : <p className="p-3">El pedido no tiene productos registrados.</p>}
      <div className="flex flex-wrap justify-between gap-2 border-t border-border-clear2 bg-brand-soft/15 p-3 font-heading">
        <span>Total</span>
        <span className="text-text-brand [.dark_&]:text-brand-soft">{formatMoney(order.total)}</span>
      </div>
    </div>
  );
}

export default function TableDetails({ table, orderPermissions, menuImages }) {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState("");
  const currentOrder = table.activeOrders.find(({ id }) => String(id) === selectedOrder) ?? table.activeOrders[0];
  const canView = orderPermissions.includes("view");
  const canEdit = canView && orderPermissions.includes("edit");

  return (
    <aside aria-label={`Información de ${table.name}`} className={`${panelClass} space-y-4 p-3 sm:p-4`}>
      <header className="relative isolate overflow-hidden rounded-xl bg-background-inverse px-4 py-5 text-text-inverse">
        <img src={restaurant} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background-inverse/80" />
        <div className="flex flex-wrap items-center gap-3">
          <Armchair size={36} aria-hidden="true" />
          <div className="mr-auto">
            <h2 className="text-title font-heading">{table.name}</h2>
            <p>{table.zone ?? "Zona sin confirmar"}</p>
          </div>
          <TableStatus status={table.status} />
        </div>
      </header>

      {table.capacity != null && <p>Capacidad: {table.capacity} personas</p>}
      <section aria-label="Pedido actual" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-subtitle font-heading">Pedido actual</h3>
          {currentOrder && canView && <span className="rounded-lg bg-background-clear px-2 py-1 text-medium text-text-coffee">#{currentOrder.id}</span>}
        </div>
        {currentOrder && canView ? (
          <>
            {table.activeOrders.length > 1 && (
              <Select variant="create" label="Pedido activo" htmlFor="tables-current-order" value={String(currentOrder.id)} options={table.activeOrders.map(({ id }) => ({ value: String(id), label: `Pedido #${id}` }))} onChange={(event) => setSelectedOrder(event.target.value)} />
            )}
            <TableOrderSummary key={currentOrder.id} orderId={currentOrder.id} menuImages={menuImages} />
          </>
        ) : (
          <p className={`rounded-xl border border-border-clear2 p-3 ${secondaryText}`}>
            {currentOrder ? "El detalle del pedido requiere permiso de consulta de órdenes." : "No hay un pedido activo registrado para esta mesa."}
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-3 [&>button:disabled]:opacity-50">
        <Button variant="tertiary" disabled={!currentOrder || !canEdit} onClick={() => navigate(`/dashboard/orders/${currentOrder.id}/edit`)}>
          <Pencil className="mr-2 size-4" aria-hidden="true" /> Editar pedido
        </Button>
        <Button variant="tertiary" disabled={!currentOrder || !canView} onClick={() => navigate(`/dashboard/orderView/${currentOrder.id}`)}>
          <FileText className="mr-2 size-4" aria-hidden="true" /> Ver detalle
        </Button>
        <Button disabled aria-describedby="tables-source-note">
          <Check className="mr-2 size-4" aria-hidden="true" /> Liberar mesa
        </Button>
      </div>
    </aside>
  );
}
