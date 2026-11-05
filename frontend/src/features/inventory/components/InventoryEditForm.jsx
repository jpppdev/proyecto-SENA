import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inventorySchema } from "../schemas/InventorySchema";
import { Input, Button, Select } from "@/shared";
import { ArrowLeft, Box, ClipboardList, Store, FileText, Check, PencilLine } from "lucide-react";
import { inventory } from "../data/inventory"; 
export default function InventoryEditForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    sku: "",
    description: "",
    initialQuantity: "",
    unit: "",
    minStock: "",
    maxStock: "",
    status: true,
    provider: "",
    expirationDate: "",
    notes: "",
  });

  const categories = [
    { label: "Cárnicos", value: "carnicos" },
    { label: "Lácteos", value: "lacteos" },
    { label: "Bebidas", value: "bebidas" }
  ];

  const units = [
    { label: "Unidades (Ud)", value: "ud" },
    { label: "Kilogramos (Kg)", value: "kg" },
    { label: "Litros (L)", value: "l" }
  ];

  const providers = [
    { label: "Distribuidora Nacional", value: "dist_nac" },
    { label: "Granjas del Valle", value: "granjas" }
  ];

  // Precargar los datos del producto
  useEffect(() => {
    // Buscamos comparando strings directamente
    const product = inventory.find((item) => String(item.id) === String(id));
    
    if (product) {
      setFormData({
        productName: product.productName || "",
        category: product.category || "", 
        sku: product.barcode || "", 
        description: product.description || "",
        initialQuantity: String(product.quantity) || "",
        unit: product.unit || "", 
        minStock: String(product.minQuantity) || "",
        maxStock: product.maxStock ? String(product.maxStock) : "",
        status: product.status === "disponible",
        provider: product.provider || "",
        expirationDate: product.expirationDate || "",
        notes: product.notes || "",
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = inventorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
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

  const CardSection = ({ icon, title, children }) => (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/40 flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-[var(--color-secondary-500)] p-2 rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-[var(--color-text-primary)] font-extrabold text-lg tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="relative w-full max-w-[1024px] mx-auto mt-10 text-[var(--color-text-primary)]">
      
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
            ¡Producto Actualizado!
          </h2>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-inverse)] mb-1">
            Editar producto
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-inverse)] opacity-90">
            Modifica la información del producto en el inventario.
          </p>
        </div>
        <button 
          type="button" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] px-5 py-2.5 text-sm font-bold hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </button>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 [&_input]:!bg-white/60 [&_select]:!bg-white/60 [&_textarea]:!bg-white/60 [&_input]:!text-[var(--color-gray-900)] [&_select]:!text-[var(--color-gray-900)] [&_textarea]:!text-[var(--color-gray-900)] [&_input]:!border-white/50 [&_select]:!border-white/50 [&_textarea]:!border-white/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: Información del producto */}
          <CardSection icon={<Box size={20} />} title="1. Información del producto">
            <div className="[&>div]:!w-full">
              <Input variant="primary" size="md" label="Nombre del producto *" htmlFor="productName" name="productName" value={formData.productName} onChange={handleChange} error={errors.productName} />
            </div>
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Select label="Categoría *" htmlFor="category" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={categories} />
              <Input variant="primary" size="md" label="Código (SKU)" htmlFor="sku" name="sku" value={formData.sku} onChange={handleChange} error={errors.sku} />
            </div>
            <div className="w-full">
              <label className="block text-[var(--text-caption)] font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Descripción</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                className="w-full rounded-md border border-[var(--color-border-clear)] px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none h-24 transition-all"
              ></textarea>
              <div className="text-right text-xs text-[var(--color-text-muted)] mt-1 font-semibold">{formData.description.length}/200</div>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </CardSection>

          {/* TARJETA 2: Control de inventario */}
          <CardSection icon={<ClipboardList size={20} />} title="2. Control de inventario">
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Cantidad inicial *" htmlFor="initialQuantity" name="initialQuantity" value={formData.initialQuantity} onChange={handleChange} error={errors.initialQuantity} />
              <Select label="Unidad de medida *" htmlFor="unit" name="unit" value={formData.unit} onChange={handleChange} error={errors.unit} options={units} />
            </div>
            <div className="[&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Stock mínimo *" htmlFor="minStock" name="minStock" value={formData.minStock} onChange={handleChange} error={errors.minStock} />
            </div>
            <div className="[&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Stock máximo" htmlFor="maxStock" name="maxStock" value={formData.maxStock} onChange={handleChange} error={errors.maxStock} />
            </div>
            
            <div className="w-full">
              <label className="block text-[var(--text-caption)] font-bold text-[var(--color-text-secondary)] mb-2 uppercase">Estado del producto</label>
              <div className="flex bg-white/40 border border-white/50 rounded-xl p-1 shadow-inner">
                <button type="button" onClick={() => setFormData({ ...formData, status: true })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.status ? 'bg-[var(--color-secondary-400)] text-white shadow-md' : 'text-[var(--color-text-muted)] hover:bg-white/50'}`}>
                  {formData.status && <Check size={16} />} Activo
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, status: false })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${!formData.status ? 'bg-white/80 text-[var(--color-gray-900)] shadow-md' : 'text-[var(--color-text-muted)] hover:bg-white/50'}`}>
                  {!formData.status && <Check size={16} />} Inactivo
                </button>
              </div>
            </div>
          </CardSection>

          {/* TARJETA 3: Proveedor */}
          <CardSection icon={<Store size={20} />} title="3. Proveedor">
            <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
              <div className="flex-1 w-full [&>div]:!w-full">
                <Select label="Proveedor *" htmlFor="provider" name="provider" value={formData.provider} onChange={handleChange} error={errors.provider} options={providers} />
              </div>
            </div>
          </CardSection>

          {/* TARJETA 4: Información adicional */}
          <CardSection icon={<FileText size={20} />} title="Información adicional">
            <div className="[&>div]:!w-full">
              <Input type="date" variant="primary" size="md" label="Fecha de vencimiento (opcional)" htmlFor="expirationDate" name="expirationDate" value={formData.expirationDate} onChange={handleChange} error={errors.expirationDate} />
            </div>
            <div className="w-full">
              <label className="block text-[var(--text-caption)] font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Notas internas</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                className="w-full rounded-md border border-[var(--color-border-clear)] px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none h-20 transition-all"
              ></textarea>
              {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes}</p>}
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
            {isSubmitting ? "ACTUALIZANDO..." : "Actualizar producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}