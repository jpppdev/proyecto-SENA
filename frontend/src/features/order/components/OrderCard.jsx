import { useState } from "react";
import { Armchair, Bike, Clock, ShoppingBag, User, Utensils } from "lucide-react";
import { Button } from "@/shared";
import { usePermissions } from "@/features/permissions";
import { showErrorAlert } from "@/shared/services/alertService";
import { formatOrderNumber, numberFormat, orderPrice, orderStates } from "../data/orderList";
import { updateOrderStatus } from "../services/orderServices";
import OrderRowActions from "./OrderRowActions";

const services = {
  mesa: { Icon: Armchair, label: "Consumo en mesa" },
  llevar: { Icon: ShoppingBag, label: "Para llevar" },
  domicilio: { Icon: Bike, label: "Delivery" },
};

export default function OrderCard({ order }) {
  const { can } = usePermissions();
  const [updating, setUpdating] = useState(false);
  const { id, stage, statusLabel, service, table, date, time, total, dishes, customerName } = order;
  const { Icon, label } = services[service] ?? { Icon: User, label: "Servicio sin registrar" };
  const serviceLabel = service === "mesa" && Number(table) > 0 ? `Mesa ${table}` : label;
  const { style } = orderStates[stage];
  const productSummary = dishes?.map(({ name, quantity }) => `${numberFormat.format(quantity)} ${name}`).join(", ");
  const inactive = stage === "disabled" || stage === "cancelled";
  const badgeClass = `rounded-full px-2.5 py-1 text-small font-medium-custom ${style}`;

  async function toggleStatus() {
    if (updating) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, inactive ? "En preparación" : "Deshabilitada");
      window.dispatchEvent(new CustomEvent("orders:updated"));
    } catch (error) {
      await showErrorAlert({ title: "No se pudo cambiar el estado", text: error.message });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article className="flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-border-clear/40 bg-background-div/90 p-3.5 shadow-sm sm:p-4 [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h2 className="flex min-w-0 items-center gap-2 break-all text-body font-heading">
          <ShoppingBag size={18} className="shrink-0" aria-hidden="true" />
          Orden {formatOrderNumber(id)}
        </h2>
        {can("orders", "edit") ? (
          <Button
            onClick={toggleStatus}
            disabled={updating}
            title={inactive ? "Reactivar orden" : "Cambiar estado a Deshabilitada"}
            aria-label={`${statusLabel}. ${inactive ? "Reactivar orden" : "Cambiar estado a Deshabilitada"}`}
            className={`${badgeClass} cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-50`}
          >
            {statusLabel}
          </Button>
        ) : <span className={badgeClass}>{statusLabel}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-medium text-text-secondary [.dark_&]:text-text-inverse">
        <span className="inline-flex items-center gap-1.5"><Icon size={16} aria-hidden="true" />{serviceLabel}</span>
        <span className="inline-flex items-center gap-1.5 border-l border-border-clear/50 pl-3" title={date}>
          <Clock size={15} aria-hidden="true" />{time || "Sin hora"}
        </span>
      </div>
      {customerName && <p className="break-words text-small text-text-secondary [.dark_&]:text-text-inverse">{customerName}</p>}
      <p className="text-subtitle leading-tight font-heading">Total: {orderPrice.format(total)}</p>

      <div className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-medium ${style}`}>
        <Utensils size={17} className="shrink-0" aria-hidden="true" />
        <p className="min-w-0 wrap-break-word">{productSummary || "Sin productos registrados"}</p>
      </div>
      <OrderRowActions order={order} variant="card" />
    </article>
  );
}
