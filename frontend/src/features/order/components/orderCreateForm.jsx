import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  ShoppingCart, 
  User, 
  Coffee, 
  CreditCard, 
  Plus, 
  Trash2, 
  Receipt 
} from "lucide-react";

import { Input, Button, Select } from "@/shared";
import { orderSchema } from "../schema/orderSchema"; 
import { createOrder, getAvailableTables } from "../services/orderServices";
import { getMenu } from "@/features/menu/services/menuServices";
import { showErrorAlert } from "@/shared/services/alertService";

// =====================================================================
// 1. OPCIONES DEL FORMULARIO
// =====================================================================
const ORDER_TYPES = [
  { label: "Consumo en Mesa", value: "mesa" },
  { label: "Para Llevar", value: "llevar" },
  { label: "Domicilio", value: "domicilio" }
];

const PAYMENT_METHODS = [
  { label: "Efectivo", value: "efectivo" },
  { label: "Tarjeta de Crédito/Débito", value: "tarjeta" },
  { label: "Transferencia (Nequi/Daviplata)", value: "transferencia" }
];

const menuPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

// =====================================================================
// 2. SUB-COMPONENTES (Fuera del componente principal)
// =====================================================================
const CardSection = ({ icon, title, children }) => (
  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/40 flex flex-col gap-5">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-[var(--color-secondary-500)] p-2 rounded-xl text-white shadow-md">
        {icon}
      </div>
      <h3 className="text-[var(--color-text-primary)] font-extrabold text-lg tracking-wide">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// =====================================================================
// 3. COMPONENTE PRINCIPAL
// =====================================================================
export default function OrderCreateForm() {
  // --- Navegación ---
  const navigate = useNavigate();

  // --- Estados de UI ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState("");
  const [tablesRequest, setTablesRequest] = useState(0);
  const [menu, setMenu] = useState(null);
  const [menuError, setMenuError] = useState("");
  const [menuRequest, setMenuRequest] = useState(0);

  // --- Estado del formulario (Cliente y Pago) ---
  const [formData, setFormData] = useState({
    customerName: "",
    orderType: "",
    tableNumber: "",
    paymentMethod: "",
    observations: "",
  });

  // --- Estado del Carrito ---
  const [orderItems, setOrderItems] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentQty, setCurrentQty] = useState("1");

  // --- Valores Derivados ---
  const totalOrder = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const needsTable = formData.orderType === "mesa";
  const selectedProduct = menu?.find(({ id }) => String(id) === currentProduct);

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
        setCurrentProduct((previous) => activeItems.some(({ id }) => String(id) === previous) ? previous : "");
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
        const available = await getAvailableTables(signal);
        if (signal.aborted) return;
        setTables(available);
        setFormData((previous) => {
          if (!previous.tableNumber || available.some(({ tableNumber }) => String(tableNumber) === previous.tableNumber)) {
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

  // =====================================================================
  // HANDLERS
  // =====================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "orderType" && value !== "mesa" ? { tableNumber: "" } : {}),
    }));
    if (name === "tableNumber" || name === "orderType") {
      setErrors((previous) => ({ ...previous, tableNumber: undefined }));
    }
  };

  const handleAddItem = () => {
    const quantity = Number(currentQty);
    if (!selectedProduct || !Number.isSafeInteger(quantity) || quantity <= 0) return;

    const newItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      name: selectedProduct.menuName,
      price: Number(selectedProduct.price),
      quantity,
    };
    setOrderItems((previous) => [...previous, newItem]);
    setCurrentProduct("");
    setCurrentQty("1");
  };

  const handleRemoveItem = (idToRemove) => {
    setOrderItems(orderItems.filter(item => item.id !== idToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    if (needsTable && !tables?.some(({ tableNumber }) => String(tableNumber) === formData.tableNumber)) {
      setErrors((previous) => ({ ...previous, tableNumber: "Selecciona una mesa disponible." }));
      return;
    }
    
    // Validar el esquema base con Zod
    const result = orderSchema.safeParse(formData);

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
      // Payload completo para el backend
      const finalOrderData = {
        ...result.data,
        items: orderItems,
        total: totalOrder
      };
      console.log("Enviando orden:", finalOrderData);
      
      const response = await createOrder(finalOrderData);
      console.log("Orden creada:", response);
      window.dispatchEvent(new CustomEvent("orders:updated"));

      // await createOrder(finalOrderData);
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

  // =====================================================================
  // RENDER PRINCIPAL
  // =====================================================================
  return (
    <div className="relative w-full max-w-[1200px] min-h-[600px] mx-auto mt-10 text-[var(--color-text-primary)]">
      
      {/* CAPA DE ÉXITO */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background-inverse)]/40 backdrop-blur-md transition-all duration-300 rounded-[2.5rem]">
          <div className="w-32 h-32 bg-[var(--color-surface-muted)] rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <Receipt className="w-14 h-14 text-[var(--color-brand)] -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-success)] rounded-full p-2 border-4 border-[var(--color-surface-muted)] -rotate-3">
              <Check className="w-6 h-6 text-[var(--color-text-inverse)]" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-[var(--color-text-primary)] text-2xl font-bold tracking-wide drop-shadow-md">
            ¡Orden Procesada!
          </h2>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
        <div>
          <h1 className="text-3xl font-extrabold  mb-1 drop-shadow-sm">
            Crear Nueva Orden
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-inverse)] opacity-90">
            Registra los datos del cliente y los productos a facturar
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-10 items-center justify-center self-start rounded-[10px] border border-brand px-5 py-2.5 text-medium font-medium-custom text-text-coffee transition-colors hover:bg-border-clear2/60 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand md:self-center"
        >
          Volver a órdenes
        </Button>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 [&_input]:!bg-white/60 [&_textarea]:!bg-white/60 [&_input]:!text-[var(--color-gray-900)] [&_textarea]:!text-[var(--color-gray-900)] [&_input]:!border-white/50 [&_textarea]:!border-white/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: Info del Cliente */}
          <CardSection icon={<User size={20} />} title="1. Datos del Servicio">
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Select variant="create" label="Tipo de Servicio *" htmlFor="orderType" name="orderType" value={formData.orderType} onChange={handleChange} error={errors.orderType} options={ORDER_TYPES} />
              <div className="min-w-0">
                <Select
                  variant="create"
                  label="Número de Mesa"
                  htmlFor="tableNumber"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  error={needsTable ? errors.tableNumber || tablesError : undefined}
                  disabled={!needsTable || !tables?.length || isSubmitting}
                  placeholder={
                    !needsTable ? "Seleccione el servicio en mesa"
                      : tablesError ? "Mesas no disponibles"
                        : !tables ? "Cargando mesas…"
                          : tables.length ? "Seleccione una mesa" : "No hay mesas disponibles"
                  }
                  options={(tables ?? []).map(({ tableNumber }) => ({ value: String(tableNumber), label: `Mesa ${tableNumber}` }))}
                />
                {needsTable && tablesError && (
                  <Button size="sm" variant="tertiary" onClick={() => setTablesRequest((request) => request + 1)}>
                    Reintentar
                  </Button>
                )}
              </div>
            </div>
            <div className="[&>div]:!w-full">
              <Input variant="primary" size="md" label="Nombre del Cliente (Opcional)" htmlFor="customerName" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} placeholder="Para llamar el pedido" />
            </div>
          </CardSection>

          {/* TARJETA 2: Selección de Productos */}
          <CardSection icon={<Coffee size={20} />} title="2. Agregar Productos">
            <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
              <div className="min-w-0 flex-1 w-full">
                <Select
                  variant="create"
                  label="Seleccionar Producto"
                  htmlFor="currentProduct"
                  name="currentProduct"
                  value={currentProduct}
                  onChange={(event) => setCurrentProduct(event.target.value)}
                  disabled={!menu?.length || isSubmitting}
                  error={menuError}
                  placeholder={menuError ? "Menú no disponible" : !menu ? "Cargando menú…" : menu.length ? "Seleccione un producto" : "No hay productos activos"}
                  options={(menu ?? []).map(({ id, menuName, price }) => ({ value: String(id), label: `${menuName} · ${menuPrice.format(price)}` }))}
                />
                {menuError && (
                  <Button size="sm" variant="tertiary" onClick={() => setMenuRequest((request) => request + 1)}>
                    Reintentar
                  </Button>
                )}
              </div>
              <div className="w-24 [&>div]:!w-full">
                <Input type="text" variant="primary" size="md" label="Cant." htmlFor="currentQty" name="currentQty" value={currentQty} onChange={(e) => setCurrentQty(e.target.value.replace(/\D/g, ''))} />
              </div>
              <button 
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProduct || Number(currentQty) <= 0 || isSubmitting}
                className="h-12 px-5 rounded-xl border-2 border-[var(--color-secondary-500)] text-[var(--color-secondary-600)] bg-white/50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-secondary-500)] hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} /> Agregar
              </button>
            </div>
          </CardSection>

          {/* TARJETA 3: Pago y Notas */}
          <CardSection icon={<CreditCard size={20} />} title="3. Pago y Notas">
            <div className="[&>div]:!w-full">
              <Select variant="create" label="Método de Pago *" htmlFor="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} error={errors.paymentMethod} options={PAYMENT_METHODS} />
            </div>
            <div className="w-full">
              <label className="block text-[var(--text-caption)] font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Observaciones del Pedido</label>
              <textarea 
                name="observations" 
                value={formData.observations} 
                onChange={handleChange}
                placeholder="Ej: Sin azúcar, leche deslactosada..."
                className="w-full rounded-md border border-[var(--color-border-clear)] px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none h-20 transition-all"
              ></textarea>
              {errors.observations && <p className="text-xs text-red-500 mt-1">{errors.observations}</p>}
            </div>
          </CardSection>

          {/* TARJETA 4: Resumen de la Orden (Carrito) */}
          <CardSection icon={<ShoppingCart size={20} />} title="Resumen del Pedido">
            <div className="flex-1 bg-white/40 border border-white/50 rounded-xl p-4 overflow-y-auto max-h-[200px]">
              {orderItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm font-medium">
                  No hay productos en la orden
                </div>
              ) : (
                <ul className="space-y-3">
                  {orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b border-white/40 pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--color-text-primary)] text-sm">{item.name}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{item.quantity} x ${item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[var(--color-text-primary)]">${(item.quantity * item.price).toLocaleString()}</span>
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] p-4 rounded-xl shadow-inner mt-2">
              <span className="font-bold text-lg">TOTAL:</span>
              <span className="font-extrabold text-2xl">${totalOrder.toLocaleString()}</span>
            </div>
          </CardSection>

        </div>

        {/* FOOTER GENERAL */}
        <div className="flex justify-end gap-4 bg-white/30 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/40 mt-6">
          <Button type="button" onClick={() => navigate(-1)} variant="secondary" size="md" className="rounded-xl border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-white/40 transition-all">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isSuccess || (needsTable && !tables?.length)}>
            {isSubmitting ? "PROCESANDO..." : "Confirmar Orden"}
          </Button>
        </div>
      </form>

    </div>
  );
}
