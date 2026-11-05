import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Select, FileInput } from "@/shared";
import { getDocumentTypes } from "@/services/selectService";
import { userSchema } from "../schemas/userSchema";
import { ArrowLeft, Check, User, UserCog } from "lucide-react";
import { users } from "../data/users"; 

export default function UserEditForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);

  
  const [formData, setFormData] = useState({
    userName: "",
    userLastName: "",
    userEmail: "",
    businessEmail: "",
    userPhone: "",
    startDate: "",
    endDate: "",
    address: "",
    userDocumentTypes: "",
    userDocumentNumber: "",
    userPassword: "",
    userImage: [],
    isActive: "true",
    role: "employee",
  });

  
  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);

   
    const userToEdit = users.find((u) => String(u.id) === String(id));

    if (userToEdit) {
      setFormData((prev) => ({
        ...prev,
        userName: userToEdit.userName || "",
        userEmail: userToEdit.userEmail || "",
        userPhone: userToEdit.userPhone || "",
        userDocumentTypes: userToEdit.userDocumentTypes || "",
        userDocumentNumber: userToEdit.userDocumentNumber || "",
        isActive: userToEdit.isActive ? "true" : "false",
       
      }));
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
   
    const result = userSchema.safeParse(formData);

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
    <div className="relative w-full max-w-[1024px] min-h-[600px] mx-auto mt-12 bg-white/30 rounded-[2.5rem] shadow-md overflow-hidden border border-[var(--color-border-strong)] p-8 md:p-10">
      
      {/* CAPA DE ÉXITO */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300">
          <div className="w-32 h-32 bg-[var(--color-secondary-200)] rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-xl relative">
            <UserCog className="w-14 h-14 text-[var(--color-secondary-500)] -rotate-3" />
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-secondary-500)] rounded-full p-2 border-4 border-[var(--color-secondary-200)] -rotate-3">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-white text-2xl font-serif italic tracking-wide drop-shadow-md">
            ¡Usuario Actualizado!
          </h2>
        </div>
      )}

      <div className="w-full relative">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <div className={`h-24 w-24 rounded-[1.75rem] rotate-3 bg-[var(--color-secondary-500)] flex items-center justify-center text-white shadow-lg overflow-hidden [&_.border-dashed]:!border-transparent [&_.text-blue-500]:!hidden ${formData.userImage?.length > 0 ? "[&>div>div:last-child]:!hidden" : ""}`}>
              {(!formData.userImage || formData.userImage.length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 -rotate-3">
                  <User className="w-8 h-8 text-white/80" />
                  <span className="text-[10px] font-bold mt-1 text-white/80">Cambiar Foto</span>
                </div>
              )}
              <div className="absolute inset-0 z-0 flex items-center justify-center -rotate-3 scale-[1.35]">
                <FileInput
                  value={formData.userImage}
                  onChange={(files) => setFormData((prev) => ({ ...prev, userImage: files }))}
                  multiple={false}
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">
              Editar Usuario
            </h1>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Actualiza los datos del empleado o admin
            </p>
          </div>
          <div className="flex-1" />
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 rounded-2xl border-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)] px-5 py-2.5 text-sm font-bold hover:bg-[var(--color-text-primary)] hover:text-[var(--color-background)] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
        </div>

        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 text-[var(--color-secondary-200)] mb-10">
          <path d="M0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6 T 260 6 T 280 6 T 300 6 T 320 6 T 340 6 T 360 6 T 380 6 T 400 6" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
            {/* PERSONALES */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-extrabold mb-6 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">1</span>
                PERSONALES
              </h3>
              <Input variant="primary" size="md" label="Nombres" htmlFor="userName" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} />
              <Input variant="primary" size="md" label="Apellidos" htmlFor="userLastName" name="userLastName" value={formData.userLastName} onChange={handleChange} error={errors.userLastName} />
              <Select label="Tipo de Documento" htmlFor="userDocumentTypes" name="userDocumentTypes" value={formData.userDocumentTypes} onChange={handleChange} error={errors.userDocumentTypes} options={documentTypes} />
              <Input variant="primary" size="md" label="Número de Documento" htmlFor="userDocumentNumber" name="userDocumentNumber" value={formData.userDocumentNumber} onChange={handleChange} error={errors.userDocumentNumber} />
              <Input variant="primary" size="md" label="Correo Electrónico" htmlFor="userEmail" name="userEmail" type="email" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} />
            </div>

            {/* EMPRESARIALES */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-extrabold mb-6 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">2</span>
                EMPRESARIALES
              </h3>
              <Input variant="primary" size="md" label="Correo Empresarial" htmlFor="businessEmail" name="businessEmail" type="email" value={formData.businessEmail} onChange={handleChange} error={errors.businessEmail} />
              <Input variant="primary" size="md" label="Número Telefónico" htmlFor="userPhone" name="userPhone" value={formData.userPhone} onChange={handleChange} error={errors.userPhone} />
              <Input variant="primary" size="md" label="Fecha Inicio Laboral" htmlFor="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} error={errors.startDate} />
              <Input variant="primary" size="md" label="Fecha Fin Laboral" htmlFor="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} error={errors.endDate} />
              <Input variant="primary" size="md" label="Dirección" htmlFor="address" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
            </div>

            {/* SENSIBLES */}
            <div className="space-y-4 [&>div]:!w-full">
              <h3 className="flex items-center gap-3 text-[var(--color-text-primary)] font-extrabold mb-6 text-lg tracking-wider">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-[var(--color-text-primary)] text-base shadow-sm">3</span>
                SENSIBLES
              </h3>
              <Select label="Estado" htmlFor="isActive" name="isActive" value={formData.isActive} onChange={handleChange} error={errors.isActive} options={[{ label: "Activo", value: "true" }, { label: "Inactivo", value: "false" }]} />
              <Select label="Tipo de Usuario" htmlFor="role" name="role" value={formData.role} onChange={handleChange} error={errors.role} options={[{ label: "Administrador", value: "admin" }, { label: "Empleado", value: "employee" }]} />
              <Input variant="primary" size="md" label="Contraseña (Opcional)" htmlFor="userPassword" name="userPassword" type="password" value={formData.userPassword} onChange={handleChange} error={errors.userPassword} placeholder="Dejar en blanco para no cambiar" />
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
              {isSubmitting ? "ACTUALIZANDO..." : "ACTUALIZAR USUARIO"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}