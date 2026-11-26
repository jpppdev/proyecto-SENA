import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuSchema } from "../schema/menuSchema";
import { createMenuItem } from "../services/menuServices";
import { Input, Button, Select, FileInput } from "@/shared";
import { Coffee, ArrowLeft, Check, UtensilsCrossed } from "lucide-react";
import { showErrorAlert } from "@/shared/services/alertService";

export default function MenuCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    menuName: "",
    category: "",
    price: "",
    prepTime: "",
    ingredients: "",
    description: "",
    allergens: "",
    isActive: "true",
    menuImage: [],
  });

  // Datos mock (Reemplazar con llamada a tu API luego)
  const menuCategories = [
    { label: "Bebidas Calientes", value: "calientes" },
    { label: "Bebidas Frías", value: "frias" },
    { label: "Panadería y Repostería", value: "panaderia" },
    { label: "Desayunos", value: "Desayunos" },
    { label: "Snacks", value: "snacks" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const dataToValidate = {
      ...formData,
      isActive: formData.isActive === "true",
      menuImage: formData.menuImage.length > 0 ? formData.menuImage : undefined,
    };

    const result = menuSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      await showErrorAlert({
        title: "Error al crear menú",
        text: "Ocurrió un problema al crear el menú. Inténtalo nuevamente.",
        timer: 3000,
      });

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Llamamos al servicio frontend que consume la API
      const response = await createMenuItem(result.data);
      console.log("Plato creado:", response);

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
    <div className="relative w-full max-w-[1024px] min-h-[600px] mx-auto mt-12 bg-background-div/60 backdrop-blur-md rounded-[2.5rem] shadow-md overflow-hidden border border-border/50 p-8 md:p-10 text-text-primary">
      
      {/* --- CAPA DE ÉXITO --- */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background-inverse/40 backdrop-blur-md transition-all duration-300">
          <div className="w-32 h-32 bg-surface-muted rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <UtensilsCrossed className="w-14 h-14 text-brand -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2 border-4 border-surface-muted -rotate-3">
              <Check className="w-6 h-6 text-text-inverse" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-text-primary text-2xl font-bold tracking-wide drop-shadow-md">
            ¡Plato Guardado!
          </h2>
        </div>
      )}

      <div className="w-full relative">
        
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">
          
          <div className="relative">
            {/* Cuadro interactivo con el FileInput activado */}
            <div className={`h-24 w-24 rounded-[1.75rem] rotate-3 bg-brand flex items-center justify-center text-text-success shadow-lg overflow-hidden [&_.border-dashed]:!border-transparent [&_.text-blue-500]:!hidden ${formData.menuImage?.length > 0 ? "[&>div>div:last-child]:!hidden" : ""}`}>
              
              {(!formData.menuImage || formData.menuImage.length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -rotate-3">
                  <Coffee className="w-8 h-8 opacity-80" />
                  <span className="text-[10px] font-bold mt-1 opacity-80">Subir Foto</span>
                </div>
              )}
              
              <div className="absolute inset-0 z-0 flex items-center justify-center -rotate-3 scale-[1.35]">
                <FileInput
                  value={formData.menuImage}
                  onChange={(files) => setFormData((prev) => ({ ...prev, menuImage: files }))}
                  multiple={false}
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Nuevo Plato
            </h1>
            <p className="text-sm font-medium text-text-muted">
              Agrega un producto al menú de la cafetería
            </p>
          </div>
          
          <div className="flex-1" />
          
          <Button 
            type="button" 
            onClick={() => navigate(-1)}
            variant="tertiary"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Button>
        </div>

        {/* DIVISOR */}
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 text-border-clear mb-8">
          <path d="M0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6 T 260 6 T 280 6 T 300 6 T 320 6 T 340 6 T 360 6 T 380 6 T 400 6" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>

        {/* CONTENEDOR SIN ETIQUETA FORM */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* Columna 1: INFORMACIÓN PRINCIPAL */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-text-primary font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-div/60 border border-border/50 text-text-primary text-base shadow-sm">1</span>
                DETALLES
              </h3>
              <Input variant="primary" size="md" label="Nombre del Plato" htmlFor="menuName" name="menuName" value={formData.menuName} onChange={handleChange} error={errors.menuName} placeholder="Ej: Capuchino Vainilla" />
              <Select variant="create" label="Categoría" htmlFor="category" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={menuCategories} />
              <Input variant="primary" size="md" label="Precio de Venta ($)" htmlFor="price" name="price" value={formData.price} onChange={handleChange} error={errors.price} placeholder="Sin puntos ni comas" />
            </div>

            {/* Columna 2: PREPARACIÓN */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-text-primary font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-div/60 border border-border/50 text-text-primary text-base shadow-sm">2</span>
                PREPARACIÓN
              </h3>
              <Input variant="primary" size="md" label="Ingredientes Principales" htmlFor="ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange} error={errors.ingredients} placeholder="Ej: Leche, Café, Vainilla..." />
              <Input variant="primary" size="md" label="Tiempo Aprox. (Minutos)" htmlFor="prepTime" name="prepTime" value={formData.prepTime} onChange={handleChange} error={errors.prepTime} placeholder="Ej: 5" />
              <Input variant="primary" size="md" label="Descripción Comercial" htmlFor="description" name="description" value={formData.description} onChange={handleChange} error={errors.description} placeholder="Descripción para el cliente" />
            </div>

            {/* Columna 3: PUBLICACIÓN */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-text-primary font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-div/60 border border-border/50 text-text-primary text-base shadow-sm">3</span>
                PUBLICACIÓN
              </h3>
              <Select variant="create" label="Estado en el Menú" htmlFor="isActive" name="isActive" value={formData.isActive} onChange={handleChange} error={errors.isActive} options={[
                { label: "Disponible", value: "true" },
                { label: "Agotado / Oculto", value: "false" }
              ]} />
              <Input variant="primary" size="md" label="Alérgenos (Opcional)" htmlFor="allergens" name="allergens" value={formData.allergens} onChange={handleChange} error={errors.allergens} placeholder="Ej: Lácteos, Nueces..." />
            </div>

          </div>

          <div className="flex justify-end gap-4 bg-background-div/60 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-border/50 mt-6">

            <Button type="button" onClick={() => navigate(-1)} variant="tertiary">
            Cancelar
            </Button>

            <Button 
              type="button"
              onClick={handleSubmit}
              variant="primary"
              disabled={isSubmitting} 
            >
              {isSubmitting ? "GUARDANDO..." : "GUARDAR MENÚ"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}