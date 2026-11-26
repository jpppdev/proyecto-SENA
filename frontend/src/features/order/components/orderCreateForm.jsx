import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MessageSquare, Receipt, Utensils } from "lucide-react";
import { Input, Button, Select } from "@/shared";
import { createOrderSchema } from "../schema/orderSchema";
import { createOrder, getAvailableTables } from "../services/orderServices";
import { MAX_ORDER_QUANTITY } from "../data/orderLimits";
import { getMenu } from "@/features/menu/services/menuServices";
import { showErrorAlert } from "@/shared/services/alertService";
import OrderCatalog from "./OrderCatalog";
import OrderSection from "./OrderSection";
import OrderSummary from "./OrderSummary";
import OrderTablePicker from "./OrderTablePicker";

const ORDER_TYPES = [
  { label: "Consumo en Mesa", value: "mesa" },
  { label: "Para Llevar", value: "llevar" },
  { label: "Domicilio", value: "domicilio" }
];

const menuPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

export default function OrderCreateForm() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState("");
  const [tablesRequest, setTablesRequest] = useState(0);
  const [menu, setMenu] = useState(null);
  const [menuError, setMenuError] = useState("");
  const [menuRequest, setMenuRequest] = useState(0);

  const [formData, setFormData] = useState({
    customerName: "",
    orderType: "mesa",
    tableNumber: "",
    observations: "",
  });

  const [orderItems, setOrderItems] = useState([]);

  const totalOrder = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const needsTable = formData.orderType === "mesa";
  const availableTables = tables?.filter(({ status }) => status === "available");
  const locked = isSubmitting || isSuccess;

  useEffect(() => {
    let controller;
    const loadMenu = async () => {
      controller?.abort();
      controller = new AbortController();
      const { signal } = controller;
      setMenu(null);
      setMenuError("");

      try {
        const catalog = await getMenu(signal);
        if (signal.aborted) return;
        const activeItems = catalog.filter(({ isActive }) => isActive);
        setMenu(activeItems);
      } catch (error) {
        if (!signal.aborted) setMenuError(error.message);
      }
    };

    loadMenu();
    window.addEventListener("menu:updated", loadMenu);
    window.addEventListener("focus", loadMenu);
    return () => {
      controller?.abort();
      window.removeEventListener("menu:updated", loadMenu);
      window.removeEventListener("focus", loadMenu);
    };
  }, [menuRequest]);

  useEffect(() => {
    if (!needsTable) return;

    let controller;
    const loadTables = async () => {
      controller?.abort();
      controller = new AbortController();
      const { signal } = controller;
      setTables(null);
      setTablesError("");

      try {
        const inventory = await getAvailableTables(signal, { includeUnavailable: true });
        if (signal.aborted) return;
        setTables(inventory);
        setFormData((previous) => {
          if (!previous.tableNumber || inventory.some(({ tableNumber, status }) => status === "available" && String(tableNumber) === previous.tableNumber)) {
            return previous;
          }
          return { ...previous, tableNumber: "" };
        });
      } catch (error) {
        if (!signal.aborted) setTablesError(error.message);
      }
    };

    loadTables();
    window.addEventListener("focus", loadTables);
    return () => {
      controller?.abort();
      window.removeEventListener("focus", loadTables);
    };
  }, [needsTable, tablesRequest]);

  const updateField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "orderType" && value !== "mesa" ? { tableNumber: "" } : {}),
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
      ...(name === "orderType" ? { tableNumber: undefined } : {}),
    }));
  };

  const handleChange = ({ target: { name, value } }) => updateField(name, value);

  const changeItemQuantity = (productId, delta, product) => {
    setOrderItems((previous) => {
      const existing = previous.find((item) => item.productId === productId);
      if (existing) {
        const quantity = Math.min(MAX_ORDER_QUANTITY, Math.max(1, existing.quantity + delta));
        return previous.map((item) => item === existing ? { ...item, quantity } : item);
      }
      if (!product) return previous;

      return [...previous, {
        productId,
        name: product.menuName,
        price: Number(product.price),
        image: product.menuImage,
        quantity: 1,
      }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    if (needsTable && !availableTables?.some(({ tableNumber }) => String(tableNumber) === formData.tableNumber)) {
      setErrors((previous) => ({ ...previous, tableNumber: "Selecciona una mesa disponible." }));
      return;
    }
    
    const result = createOrderSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      await showErrorAlert({
        title: "Error al crear orden",
        text: "Ocurrió un problema al crear la orden. Inténtalo nuevamente.",
        timer: 3000,
      });

      return;
    }

    if (orderItems.length === 0) {
      alert("Debes agregar al menos un producto a la orden.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const finalOrderData = {
        ...result.data,
        items: orderItems.map(({ productId, name, price, quantity }) => ({ id: String(productId), productId, name, price, quantity })),
        total: totalOrder
      };
      
      await createOrder(finalOrderData);
      window.dispatchEvent(new CustomEvent("orders:updated"));

      setIsSuccess(true);
      setTimeout(() => navigate(-1), 2500);
    } catch (error) {
      if (error.status === 409 && needsTable) {
        setFormData((previous) => ({ ...previous, tableNumber: "" }));
        setErrors((previous) => ({ ...previous, tableNumber: error.message }));
        setTablesRequest((request) => request + 1);
        return;
      }
      if (error.status === 422) {
        setMenuRequest((request) => request + 1);
        await showErrorAlert({ title: "Revisa los productos de la orden", text: error.message });
        return;
      }
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[1680px] px-3 py-5 text-text-primary sm:p-6 [.dark_&]:text-text-inverse">
      {isSuccess && (
        <div role="status" className="fixed inset-0 z-50 grid place-items-center bg-background-inverse/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-background-div p-8 text-text-primary shadow-xl">
            <span className="relative grid size-16 place-items-center rounded-2xl bg-background-clear text-text-brand">
              <Receipt size={34} aria-hidden="true" />
              <Check size={22} aria-hidden="true" className="absolute -right-2 -bottom-1 rounded-full bg-success p-1 text-text-inverse" />
            </span>
            <p className="text-title font-heading">¡Orden procesada!</p>
          </div>
        </div>
      )}

      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 sm:mb-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-linear-to-b from-brand to-brand-hover text-text-inverse shadow-md sm:size-15">
            <Utensils size={28} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-title leading-tight font-heading sm:text-main">Crear Nueva Orden</h1>
            <p className="mt-1 text-medium text-text-secondary sm:text-body [.dark_&]:text-text-inverse">Registra un pedido, selecciona la mesa y agrega los productos.</p>
          </div>
        </div>
        <Button onClick={() => navigate(-1)} disabled={locked} className="inline-flex min-h-10 items-center gap-3 rounded-xl border border-brand px-4 py-2 text-medium font-medium-custom enabled:hover:bg-brand-soft/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50">
          <ArrowLeft size={19} aria-hidden="true" className="text-text-brand [.dark_&]:text-brand-soft" />
          Volver a Órdenes
        </Button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 [.dark_&]:[&_.form-field-create-label]:text-text-inverse [.dark_&]:[&_.form-field-create>p]:text-brand-soft" aria-busy={isSubmitting}>
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,46fr)_minmax(0,54fr)]">
          <div className="min-w-0 space-y-4">
            <OrderSection id="order-service-heading" icon="1" title="Datos del Servicio">
              <div className="grid items-start gap-4 sm:grid-cols-2">
                <Select variant="create" label="Tipo de Servicio *" htmlFor="orderType" name="orderType" value={formData.orderType} onChange={handleChange} error={errors.orderType} options={ORDER_TYPES} disabled={locked} />
                <div className="[&>div]:w-full [&_label+div]:h-auto">
                  <Input
                    htmlFor="customerName"
                    name="customerName"
                    label={<span className="form-field-create-label">Nombre del Cliente <span className="font-normal">(opcional)</span></span>}
                    placeholder="Ej. Juan Pérez"
                    value={formData.customerName}
                    onChange={handleChange}
                    aria-invalid={!!errors.customerName}
                    aria-describedby={errors.customerName ? "order-customer-error" : undefined}
                    disabled={locked}
                    className="form-field-create-control relative"
                  />
                  {errors.customerName && <p id="order-customer-error" className="mt-1 text-small text-error [.dark_&]:text-brand-soft">{errors.customerName}</p>}
                </div>
              </div>
            </OrderSection>

            <OrderTablePicker
              tables={tables}
              value={formData.tableNumber}
              needsTable={needsTable}
              disabled={locked}
              error={errors.tableNumber}
              loadError={tablesError}
              onChange={(value) => updateField("tableNumber", value)}
              onRetry={() => setTablesRequest((request) => request + 1)}
            />

            <OrderSection id="order-notes-heading" icon={<MessageSquare size={21} />} title="3. Notas del Pedido">
              <label htmlFor="observations" className="form-field-create-label">Observaciones del Pedido</label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Ej. Sin azúcar, extra salsa, etc."
                aria-invalid={!!errors.observations}
                aria-describedby={errors.observations ? "order-observations-error" : undefined}
                disabled={locked}
                className="form-field-create-control min-h-20 resize-y py-2"
              />
              {errors.observations && <p id="order-observations-error" role="alert" className="mt-1 text-small text-error [.dark_&]:text-brand-soft">{errors.observations}</p>}
            </OrderSection>
          </div>

          <div className="min-w-0 space-y-4">
            <OrderCatalog
              menu={menu}
              error={menuError}
              disabled={locked}
              onRetry={() => setMenuRequest((request) => request + 1)}
              onAdd={(product) => changeItemQuantity(product.id, 1, product)}
              formatPrice={menuPrice.format}
            />
            <OrderSummary
              items={orderItems}
              total={totalOrder}
              formatPrice={menuPrice.format}
              disabled={locked}
              onQuantityChange={changeItemQuantity}
              onRemove={(productId) => setOrderItems((previous) => previous.filter((item) => item.productId !== productId))}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 rounded-3xl border border-border-clear/40 bg-background-div/80 p-4 shadow-sm sm:p-5 [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse">
            <Button onClick={() => navigate(-1)} disabled={locked} className="min-h-10 rounded-xl border border-border-clear px-4 font-medium-custom enabled:hover:bg-brand-soft/20 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50">
              Cancelar
            </Button>
            <Button type="submit" disabled={locked || (needsTable && !availableTables?.length)} className="min-h-10 rounded-xl bg-brand-hover px-4 font-medium-custom text-text-inverse enabled:hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50">
              {isSubmitting ? "Procesando…" : "Confirmar Orden"}
            </Button>
        </div>
      </form>
    </div>
  );
}
