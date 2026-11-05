import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { menuSchema } from "../schema/menuSchema";
import { Input, Button, Select, FileInput } from "@/shared";
import { Coffee, ArrowLeft, Check, UtensilsCrossed, PencilLine } from "lucide-react";
import { menu } from "../data/menu";

export default function MenuEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

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

  const menuCategories = [
    { label: "Bebidas Calientes", value: "calientes" },
    { label: "Bebidas Frías", value: "frias" },
    { label: "Panadería y Repostería", value: "panaderia" },
    { label: "Desayunos", value: "desayunos" },
    { label: "Snacks", value: "snacks" }
  ];


  useEffect(() => {
    const dish = menu.find((item) => String(item.id) === String(id));
    
    if (dish) {
      setFormData({
        menuName: dish.menuName || "",
        category: dish.category || "",
        price: String(dish.price) || "",
        prepTime: dish.prepTime || "",
        ingredients: dish.ingredients || "",
        description: dish.description || "",
        allergens: dish.allergens || "",
        isActive: dish.isActive ? "true" : "false",
        menuImage: [],
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
    <div className="relative w-full max-w-[1024px] min-h-[600px] mx-auto mt-12 bg-white/30 backdrop-blur-md rounded-[2.5rem] shadow-md overflow-hidden border border-white/40 p-8 md:p-10">
      
      {/* CAPA DE ÉXITO */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background-inverse)]/40 backdrop-blur-md transition-all duration-300">
          <div className="w-32 h-32 bg-[var(--color-surface-muted)] rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <PencilLine className="w-14 h-14 text-[var(--color-brand)] -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-success)] rounded-full p-2 border-4 border-[var(--color-surface-muted)] -rotate-3">
              <Check className="w-6 h-6 text-[var(--color-text-inverse)]" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-[var(--color-text-primary)] text-2xl font-bold tracking-wide drop-shadow-md">
            ¡Plato Actualizado!
          </h2>
        </div>
      )}

      <div className="w-full relative">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className={`h-24 w-24 rounded-[1.75rem] rotate-3 bg-[var(--color-secondary-500)] flex items-center justify-center text-white shadow-lg overflow-hidden [&_.border-dashed]:!border-transparent [&_.text-blue-500]:!hidden ${formData.menuImage?.length > 0 ? "[&>div>div:last-child]:!hidden" : ""}`}>
              {(!formData.menuImage || formData.menuImage.length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -rotate-3">
                  <Coffee className="w-8 h-8 opacity-80" />
                  <span className="text-[10px] font-bold mt-1 opacity-80">Cambiar Foto</span>
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
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
              Editar Plato
            </h1>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Modifica los detalles del producto en el menú
            </p>
          </div>
          <div className="flex-1" />
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 rounded-full border-2 border-white text-white px-5 py-2 text-sm font-bold hover:bg-white/20 transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
        </div>

        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 text-[var(--color-border-clear)] mb-8">
          <path d="M0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6 T 260 6 T 280 6 T 300 6 T 320 6 T 340 6 T 360 6 T 380 6 T 400 6" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>

        <form onSubmit={handleSubmit} className="[&_input]:!bg-white/60 [&_select]:!bg-white/60 [&_input]:!text-[var(--color-gray-900)] [&_select]:!text-[var(--color-gray-900)] [&_input]:!border-white/50 [&_select]:!border-white/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* INFORMACIÓN PRINCIPAL */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">1</span>
                DETALLES
              </h3>
              <Input variant="primary" size="md" label="Nombre del Plato" htmlFor="menuName" name="menuName" value={formData.menuName} onChange={handleChange} error={errors.menuName} />
              <Select label="Categoría" htmlFor="category" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={menuCategories} />
              <Input variant="primary" size="md" label="Precio de Venta ($)" htmlFor="price" name="price" value={formData.price} onChange={handleChange} error={errors.price} />
            </div>

            {/* PREPARACIÓN */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">2</span>
                PREPARACIÓN
              </h3>
              <Input variant="primary" size="md" label="Ingredientes Principales" htmlFor="ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange} error={errors.ingredients} />
              <Input variant="primary" size="md" label="Tiempo Aprox. (Minutos)" htmlFor="prepTime" name="prepTime" value={formData.prepTime} onChange={handleChange} error={errors.prepTime} />
              <Input variant="primary" size="md" label="Descripción Comercial" htmlFor="description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
            </div>

            {/* PUBLICACIÓN */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-bold mb-4 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">3</span>
                PUBLICACIÓN
              </h3>
              <Select label="Estado en el Menú" htmlFor="isActive" name="isActive" value={formData.isActive} onChange={handleChange} error={errors.isActive} options={[{ label: "Disponible", value: "true" }, { label: "Agotado / Oculto", value: "false" }]} />
              <Input variant="primary" size="md" label="Alérgenos (Opcional)" htmlFor="allergens" name="allergens" value={formData.allergens} onChange={handleChange} error={errors.allergens} />
            </div>
          </div>

          <div className="flex justify-end mt-12 border-t-2 border-[var(--color-border-strong)] pt-8">
            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              disabled={isSubmitting} 
              className="rounded-full bg-[var(--color-text-primary)] !text-[var(--color-background)] px-10 py-3.5 text-sm font-bold shadow-lg hover:opacity-80 active:scale-95 transition-all !border-none"
            >
              {isSubmitting ? "ACTUALIZANDO..." : "ACTUALIZAR MENÚ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}