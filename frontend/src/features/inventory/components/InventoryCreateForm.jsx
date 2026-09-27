import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inventorySchema } from "../schemas/InventorySchema";
import { Input, Button, Select } from "@/shared";
import { ArrowLeft, Box, ClipboardList, Store, FileText, Check, Plus, PackagePlus } from "lucide-react";
import { showErrorAlert } from "@/shared/services/alertService";

export default function InventoryCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    sku: "",
    description: "",
    initialQuantity: "",
    unit: "",
    minStock: "",
    maxStock: "",
    status: true, // true = Activo
    provider: "",
    expirationDate: "",
    notes: "",
  });

  // Datos mock para los Selects (reemplazar luego con datos de tu API)
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Zod validará directamente los strings con tus regex
    const result = inventorySchema.safeParse(formData);

        if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      await showErrorAlert({
        title: "Error al crear producto",
        text: "Ocurrió un problema al crear el producto. Inténtalo nuevamente.",
        timer: 3000,
      });

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Aquí iría tu llamado real a la API
      alert("Producto creado exitosamente");
      navigate(-1);
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
   <div className="w-full max-w-[1024px] mx-auto mt-10 text-[var(--color-text-primary)]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-inverse)] mb-1">
            Crear nuevo producto
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-inverse)] opacity-90">
            Complete la información para agregar un nuevo producto al inventario.
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

      {/* 
        FORMULARIO: Aquí inyectamos las clases para cambiar mágicamente el color 
        de tus componentes Input, Select y Textarea a un blanco translúcido suave 
      */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 [&_input]:!bg-white/60 [&_select]:!bg-white/60 [&_textarea]:!bg-white/60 [&_input]:!text-[var(--color-gray-900)] [&_select]:!text-[var(--color-gray-900)] [&_textarea]:!text-[var(--color-gray-900)] [&_input]:!border-white/50 [&_select]:!border-white/50 [&_textarea]:!border-white/50"
      >
        
        {/* GRID DE TARJETAS 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: Información del producto */}
          <CardSection icon={<Box size={20} />} title="1. Información del producto">
            <div className="[&>div]:!w-full">
              <Input variant="primary" size="md" label="Nombre del producto *" htmlFor="productName" name="productName" value={formData.productName} onChange={handleChange} error={errors.productName} placeholder="Ej: Pechuga de pollo" />
            </div>
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Select label="Categoría *" htmlFor="category" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={categories} />
              <Input variant="primary" size="md" label="Código (SKU)" htmlFor="sku" name="sku" value={formData.sku} onChange={handleChange} error={errors.sku} placeholder="Ej: POL-001" />
            </div>
            <div className="w-full">
              <label className="block text-[var(--text-caption)] font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Descripción</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Describa las características del producto..."
                className="w-full rounded-md border border-[var(--color-border-clear)] px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none h-24 transition-all"
              ></textarea>
              <div className="text-right text-xs text-[var(--color-text-muted)] mt-1 font-semibold">{formData.description.length}/200</div>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </CardSection>

          {/* TARJETA 2: Control de inventario */}
          <CardSection icon={<ClipboardList size={20} />} title="2. Control de inventario">
            <div className="grid grid-cols-2 gap-4 [&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Cantidad inicial *" htmlFor="initialQuantity" name="initialQuantity" value={formData.initialQuantity} onChange={handleChange} error={errors.initialQuantity} placeholder="Ej: 25" />
              <Select label="Unidad de medida *" htmlFor="unit" name="unit" value={formData.unit} onChange={handleChange} error={errors.unit} options={units} />
            </div>
            <div className="[&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Stock mínimo *" htmlFor="minStock" name="minStock" value={formData.minStock} onChange={handleChange} error={errors.minStock} placeholder="Ej: 5" />
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-semibold">Cantidad mínima para generar alerta de stock.</p>
            </div>
            <div className="[&>div]:!w-full">
              <Input type="text" variant="primary" size="md" label="Stock máximo" htmlFor="maxStock" name="maxStock" value={formData.maxStock} onChange={handleChange} error={errors.maxStock} placeholder="Ej: 100" />
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-semibold">Cantidad máxima recomendada en inventario.</p>
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
              <button 
                type="button"
                className="h-12 w-full sm:w-auto px-6 rounded-xl border-2 border-[var(--color-secondary-500)] text-[var(--color-secondary-600)] bg-white/50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-secondary-500)] hover:text-white transition-all whitespace-nowrap shadow-sm"
              >
                <Plus size={16} /> Nuevo proveedor
              </button>
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
                placeholder="Notas adicionales sobre el producto..."
                className="w-full rounded-md border border-[var(--color-border-clear)] px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none h-20 transition-all"
              ></textarea>
              <div className="text-right text-xs text-[var(--color-text-muted)] mt-1 font-semibold">{formData.notes.length}/200</div>
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
            <PackagePlus size={18} />
            {isSubmitting ? "CREANDO..." : "Crear producto"}
          </Button>
        </div>
      </form>

    </div>
  );
}