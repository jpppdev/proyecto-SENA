import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/shared";
import { MAX_ORDER_QUANTITY } from "../data/orderLimits";
import OrderProductImage from "./OrderProductImage";
import OrderSection from "./OrderSection";

const actionClass = "grid size-8 shrink-0 place-items-center rounded-lg text-text-brand [.dark_&]:text-brand-soft enabled:hover:bg-brand-soft/30 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50";


export default function OrderSummary({ items, total, formatPrice, disabled, onQuantityChange, onRemove }) {
  return (
    <OrderSection id="order-summary-heading" icon={<ShoppingCart size={22} />} title="Resumen del Pedido">
      {items.length ? (
        <div className="overflow-x-auto rounded-xl border border-border-clear/40">
          <table className="w-full text-left text-medium">
            <thead className="bg-background-clear text-text-primary [.dark_&]:bg-background-inverse [.dark_&]:text-text-inverse">
              <tr>
                <th scope="col" className="px-2 py-2 sm:px-3">Producto</th>
                <th scope="col" className="px-2 text-center">Cantidad</th>
                <th scope="col" className="hidden px-2 text-right sm:table-cell">Precio</th>
                <th scope="col" className="px-2 text-right">Subtotal</th>
                <th scope="col"><span className="sr-only">Eliminar</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId} className="border-t border-border-clear/30">
                  <th scope="row" className="px-2 py-2 font-medium-custom sm:px-3">
                    <div className="flex items-center gap-2">
                      <OrderProductImage src={item.image} className="hidden h-8 w-10 rounded-md sm:grid" />
                      <div>
                        {item.name}
                        <span className="block text-small font-normal sm:hidden">{formatPrice(item.price)} c/u</span>
                      </div>
                    </div>
                  </th>
                  <td className="px-1">
                    <div className="mx-auto flex w-fit items-center rounded-xl border border-border-clear/60">
                      <Button aria-label={`Reducir cantidad de ${item.name}`} disabled={disabled || item.quantity <= 1} onClick={() => onQuantityChange(item.productId, -1)} className={actionClass}>
                        <Minus size={16} aria-hidden="true" />
                      </Button>
                      <span className="min-w-4 text-center font-medium-custom tabular-nums">{item.quantity}</span>
                      <Button aria-label={`Aumentar cantidad de ${item.name}`} disabled={disabled || item.quantity >= MAX_ORDER_QUANTITY} onClick={() => onQuantityChange(item.productId, 1)} className={actionClass}>
                        <Plus size={16} aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-2 text-right sm:table-cell">{formatPrice(item.price)}</td>
                  <td className="whitespace-nowrap px-2 text-right font-heading">{formatPrice(item.price * item.quantity)}</td>
                  <td className="pr-1">
                    <Button aria-label={`Eliminar ${item.name}`} disabled={disabled} onClick={() => onRemove(item.productId)} className={actionClass}>
                      <Trash2 size={17} aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-border-clear/40 p-4 text-center text-medium">No hay productos en la orden.</p>
      )}
      <div role="status" aria-atomic="true" className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--color-primary-950)] px-4 py-3 font-heading text-text-inverse">
        <span className="text-subtitle">TOTAL</span>
        <span className="text-title tabular-nums">{formatPrice(total)}</span>
      </div>
    </OrderSection>
  );
}
