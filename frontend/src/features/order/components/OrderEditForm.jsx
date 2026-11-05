import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  ShoppingCart, 
  User, 
  Coffee, 
  CreditCard, 
  Plus, 
  Trash2, 
  PencilLine 
} from "lucide-react";

import { Input, Button, Select } from "@/shared";
import { orderSchema } from "../schema/orderSchema"; 
import { orders } from "../data/order"; 

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


const AVAILABLE_PRODUCTS = [
  { label: "Café Americano - $5.000", value: "p1", price: 5000, name: "Café Americano" },
  { label: "Capuchino Vainilla - $7.500", value: "p2", price: 7500, name: "Capuchino Vainilla" },
  { label: "Hamburguesa especial - $20.000", value: "p3", price: 20000, name: "Hamburguesa especial" },
  { label: "Pizza personal - $25.000", value: "p4", price: 25000, name: "Pizza personal" },
  { label: "Gaseosa - $2.500", value: "p5", price: 2500, name: "Gaseosa" }
];


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

export default function OrderEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerName: "",
    orderType: "",
    tableNumber: "",
    paymentMethod: "",
    observations: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentQty, setCurrentQty] = useState("1");

  const totalOrder = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);


  useEffect(() => {
    const orderToEdit = orders.find((item) => String(item.id) === String(id));
    
    if (orderToEdit) {
      setFormData({
        customerName: orderToEdit.customerName || "",
        orderType: orderToEdit.table ? "mesa" : "domicilio",
        tableNumber: orderToEdit.table ? String(orderToEdit.table) : "",
        paymentMethod: "efectivo", 
        observations: orderToEdit.observations || "",
      });


      if (orderToEdit.dishes && orderToEdit.dishes.length > 0) {
        const loadedDishes = orderToEdit.dishes.map((dish, index) => ({
          id: `loaded-${index}`, 
          productId: `mock-${index}`, 
          name: dish.name,
          price: dish.price,
          quantity: dish.quantity
        }));
        setOrderItems(loadedDishes);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    if (!currentProduct || !currentQty || parseInt(currentQty) <= 0) return;
    
    const productDef = AVAILABLE_PRODUCTS.find(p => p.value === currentProduct);
    
    if (productDef) {
      const newItem = {
        id: Date.now().toString(),
        productId: productDef.value,
        name: productDef.name,
        price: productDef.price,
        quantity: parseInt(currentQty)
      };
      setOrderItems([...orderItems, newItem]);
      setCurrentProduct("");
      setCurrentQty("1");
    }
  };

  const handleRemoveItem = (idToRemove) => {
    setOrderItems(orderItems.filter(item => item.id !== idToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (orderItems.length === 0) {
      alert("Debes mantener al menos un producto en la orden.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      setIsSuccess(true);
      setTimeout(() => navigate(-1), 2500);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] min-h-[600px] mx-auto mt-10 text-[var(--color-text-primary)]">
      
      {/* CAPA DE ÉXITO */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background-inverse)]/40 backdrop-blur-md transition-all duration-300 rounded-[2.5rem]">
          <div className="w-32 h-32 bg-[var(--color-surface-muted)] rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <PencilLine className="w-14 h-14 text-[var(--color-brand)] -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-success)] rounded-full p-2 border-4 border-[var(--color-surface-muted)] -rotate-3">
              <Check className="w-6 h-6 text-[var(--color-text-inverse)]" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-[var(--color-text-primary)] text-2xl font-bold tracking-wide drop-shadow-md">
            ¡Orden Actualizada!
          </h2>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-inverse)] mb-1 drop-shadow-sm">
            Editar Orden #{id}
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-inverse)] opacity-90">
            Modifica los detalles del cliente o los productos facturados
          </p>
        </div>
        <button 
          type="button" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] px-5 py-2.5 text-sm font-bold hover:bg-white/20 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a órdenes
        </button>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 [&_input]:!bg-white/60 [&_select]:!bg-white/60 [&_textarea]:!bg-white/60 [&_input]:!text-[var(--color-gray-900)] [&_select]:!text-[var(--color-gray-900)] [&_textarea]:!text-[var(--color-gray-900)] [&_input]:!border-white/50 [&_select]:!border-white/50 [&_textarea]:!border-white/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: Info del Cliente */}
          <CardSection icon={<User size={20} />} title="1. Datos del Servicio">
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Select label="Tipo de Servicio *" htmlFor="orderType" name="orderType" value={formData.orderType} onChange={handleChange} error={errors.orderType} options={ORDER_TYPES} />
              <Input variant="primary" size="md" label="Número de Mesa" htmlFor="tableNumber" name="tableNumber" value={formData.tableNumber} onChange={handleChange} error={errors.tableNumber} placeholder="Ej: 04" disabled={formData.orderType !== 'mesa'} />
            </div>
            <div className="[&>div]:!w-full">
              <Input variant="primary" size="md" label="Nombre del Cliente (Opcional)" htmlFor="customerName" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} placeholder="Para llamar el pedido" />
            </div>
          </CardSection>

          {/* TARJETA 2: Selección de Productos */}
          <CardSection icon={<Coffee size={20} />} title="2. Agregar Productos">
            <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
              <div className="flex-1 w-full [&>div]:!w-full">
                <Select label="Seleccionar Producto" htmlFor="currentProduct" name="currentProduct" value={currentProduct} onChange={(e) => setCurrentProduct(e.target.value)} options={AVAILABLE_PRODUCTS} />
              </div>
              <div className="w-24 [&>div]:!w-full">
                <Input type="text" variant="primary" size="md" label="Cant." htmlFor="currentQty" name="currentQty" value={currentQty} onChange={(e) => setCurrentQty(e.target.value.replace(/\D/g, ''))} />
              </div>
              <button 
                type="button"
                onClick={handleAddItem}
                className="h-12 px-5 rounded-xl border-2 border-[var(--color-secondary-500)] text-[var(--color-secondary-600)] bg-white/50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-secondary-500)] hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} /> Agregar
              </button>
            </div>
          </CardSection>

          {/* TARJETA 3: Pago y Notas */}
          <CardSection icon={<CreditCard size={20} />} title="3. Pago y Notas">
            <div className="[&>div]:!w-full">
              <Select label="Método de Pago *" htmlFor="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} error={errors.paymentMethod} options={PAYMENT_METHODS} />
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
            <div className="flex-1 bg-white/40 border border-white/50 rounded-xl p-4 overflow-y-auto max-h-[200px] custom-scrollbar">
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
                        <span className="text-xs text-[var(--color-text-muted)]">{item.quantity} x ${item.price.toLocaleString("es-CO")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[var(--color-text-primary)]">${(item.quantity * item.price).toLocaleString("es-CO")}</span>
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
              <span className="font-extrabold text-2xl">${totalOrder.toLocaleString("es-CO")}</span>
            </div>
          </CardSection>

        </div>

        {/* FOOTER GENERAL */}
        <div className="flex justify-end gap-4 bg-white/30 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/40 mt-6">
          <Button type="button" onClick={() => navigate(-1)} variant="secondary" size="md" className="rounded-xl border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-white/40 transition-all">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary" size="md" className="rounded-xl flex items-center gap-2 bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] !border-none px-8 shadow-md">
            <PencilLine size={18} />
            {isSubmitting ? "ACTUALIZANDO..." : "Actualizar Orden"}
          </Button>
        </div>
      </form>
    </div>
  );
}