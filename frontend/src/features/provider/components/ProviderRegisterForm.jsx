import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { providerSchema } from "../schemas/providerSchemas";
import { Input, Button, Select, FileInput } from "@/shared";
import { Store, ArrowLeft, Check, Truck } from "lucide-react";
import { showErrorAlert } from "@/shared/services/alertService";

export default function ProviderRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    providerName: "",
    email: "",
    phone: "",
    address: "",
    products: "",
    isActive: "true",
    observations: "",
    providerImage: [], // Añadido para el logo
  });

  const documentTypes = [
    { label: "NIT", value: "NIT" },
    { label: "Cédula de Ciudadanía", value: "CC" },
    { label: "Cédula de Extranjería", value: "CE" },
    { label: "Permiso Especial (PEP)", value: "PEP" },
    { label: "Protección Temporal (PPT)", value: "PPT" }
  ];

  const inventoryProducts = [
    { label: "Granos de Café", value: "cafe" },
    { label: "Leche Entera", value: "leche" },
    { label: "Vasos Desechables", value: "vasos" },
    { label: "Insumos de Aseo", value: "aseo" }
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

    // Filtramos la data antes de pasarla a Zod
    const dataToValidate = {
      ...formData,
      isActive: formData.isActive === "true",
      // Si el arreglo está vacío, mandamos undefined para que .optional() funcione
      providerImage: formData.providerImage.length > 0 ? formData.providerImage : undefined,
    };

    const result = providerSchema.safeParse(dataToValidate);

      if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      await showErrorAlert({
        title: "Error al crear proveedor",
        text: "Ocurrió un problema al crear el proveedor. Inténtalo nuevamente.",
        timer: 3000,
      });

      console.log("Zod bloqueó el envío por estos errores:", fieldErrors);

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Aquí iría tu llamado a la API: await createProvider(result.data);
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
    <div className="relative w-full max-w-[1024px] min-h-[600px] mx-auto mt-12 bg-white/30 rounded-[2.5rem] shadow-md overflow-hidden border border-[var(--color-border-strong)] p-8 md:p-10">
      
      {/* --- CAPA DE ÉXITO --- */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background-inverse)]/40 backdrop-blur-md transition-all duration-300">
          <div className="w-32 h-32 bg-[var(--color-surface-muted)] rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <Truck className="w-14 h-14 text-[var(--color-brand)] -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-success)] rounded-full p-2 border-4 border-[var(--color-surface-muted)] -rotate-3">
              <Check className="w-6 h-6 text-[var(--color-text-inverse)]" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-[var(--color-text-primary)] text-2xl font-bold tracking-wide drop-shadow-md">
            ¡Proveedor Guardado!
          </h2>
        </div>
      )}

      <div className="w-full relative">
        
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">
          
          <div className="relative">
            {/* Cuadro interactivo con el FileInput activado */}
            <div className={`h-24 w-24 rounded-[1.75rem] rotate-3 bg-[var(--color-secondary-500)] flex items-center justify-center text-white shadow-lg overflow-hidden [&_.border-dashed]:!border-transparent [&_.text-blue-500]:!hidden ${formData.providerImage?.length > 0 ? "[&>div>div:last-child]:!hidden" : ""}`}>
              
              {(!formData.providerImage || formData.providerImage.length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -rotate-3">
                  <Store className="w-8 h-8 opacity-80" />
                  <span className="text-[10px] font-bold mt-1 opacity-80">Subir Logo</span>
                </div>
              )}
              
              <div className="absolute inset-0 z-0 flex items-center justify-center -rotate-3 scale-[1.35]">
                <FileInput
                  value={formData.providerImage}
                  onChange={(files) => setFormData((prev) => ({ ...prev, providerImage: files }))}
                  multiple={false}
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
              Nuevo Proveedor
            </h1>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Registra los datos de la empresa y contacto
            </p>
          </div>
          
          <div className="flex-1" />
          
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 rounded-full border-2 border-white text-white px-5 py-2 text-sm font-bold hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
        </div>

        {/* DIVISOR */}
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 text-[var(--color-border-clear)] mb-8">
          <path d="M0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6 T 260 6 T 280 6 T 300 6 T 320 6 T 340 6 T 360 6 T 380 6 T 400 6" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* Columna 1: IDENTIFICACIÓN */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-clear)] text-[var(--color-text-primary)] text-base shadow-sm">1</span>
                IDENTIFICACIÓN
              </h3>
              <Select label="Tipo de Documento" htmlFor="documentType" name="documentType" value={formData.documentType} onChange={handleChange} error={errors.documentType} options={documentTypes} />
              <Input variant="primary" size="md" label="Número de Documento" htmlFor="documentNumber" name="documentNumber" value={formData.documentNumber} onChange={handleChange} error={errors.documentNumber} placeholder="Sin puntos ni guiones" />
              <Input variant="primary" size="md" label="Nombre de la Empresa" htmlFor="providerName" name="providerName" value={formData.providerName} onChange={handleChange} error={errors.providerName} placeholder="Ej: Distribuidora S.A." />
            </div>

            {/* Columna 2: CONTACTO */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-clear)] text-[var(--color-text-primary)] text-base shadow-sm">2</span>
                CONTACTO
              </h3>
              <Input variant="primary" size="md" label="Correo Electrónico" htmlFor="email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="ventas@empresa.com" />
              <Input variant="primary" size="md" label="Número de Contacto" htmlFor="phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="Ej: 3001234567" />
              <Input variant="primary" size="md" label="Dirección (Opcional)" htmlFor="address" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="Ej: Calle 123 #45-67" />
            </div>

            {/* Columna 3: DETALLES */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-clear)] text-[var(--color-text-primary)] text-base shadow-sm">3</span>
                DETALLES
              </h3>
              <Select label="Estado del Proveedor" htmlFor="isActive" name="isActive" value={formData.isActive} onChange={handleChange} error={errors.isActive} options={[
                { label: "Habilitado", value: "true" },
                { label: "Inhabilitado", value: "false" }
              ]} />
              <Select label="Productos (Opcional)" htmlFor="products" name="products" value={formData.products} onChange={handleChange} error={errors.products} options={inventoryProducts} />
              <Input variant="primary" size="md" label="Observaciones Internas" htmlFor="observations" name="observations" value={formData.observations} onChange={handleChange} error={errors.observations} placeholder="Notas adicionales..." />
            </div>

          </div>

          <div className="flex justify-end mt-10 border-t-2 border-[var(--color-border-strong)] pt-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              disabled={isSubmitting} 
              className="rounded-full bg-[var(--color-text-primary)] !text-[var(--color-background)] px-10 py-3.5 text-sm font-bold shadow-lg hover:opacity-80 active:scale-95 transition-all !border-none disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? "GUARDANDO..." : "GUARDAR PROVEEDOR"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}