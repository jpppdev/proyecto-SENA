import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import newPassword from "../../../assets/images/NewPassword.png";
import title from "../../../assets/images/1-logo.png";
import { newPasswordSchema } from "../schemas/NewPasswordSchema";
import { showSuccessAlert } from "@/shared/services/alertService";

function NewPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      password,
      confirmPassword,
    };

    const result = newPasswordSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    showSuccessAlert({
      title: "Contraseña cambiada",
      text: "Tu contraseña fue cambiada con éxito.",
      timer: 3000,
    });

    navigate("/login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      {/* Tarjeta con ALTO y ANCHO FIJOS intactos */}
      <div className="relative z-10 w-[1000px] h-[600px] bg-background-div rounded-4xl shadow-2xl flex overflow-hidden">
        
        {/* Imagen */}
        <div className="w-1/2 h-full">
          <img
            src={newPassword}
            alt="Restaurante"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-1/2 h-full flex items-center justify-center p-6"
        >
          {/* Contenedor Maestro w-80: Iguala el ancho de todos los elementos */}
          <div className="w-80 flex flex-col justify-center">
            
            <img
              src={title}
              alt="Title"
              className="w-48 mx-auto mb-4"
            />

            <h1 className="text-main font-heading text-text-negative text-center mb-3">
              Renovar Contraseña
            </h1>

            <p className="text-body text-text-secondary text-center mb-5">
              Ingresa y confirma tu nueva contraseña para
              completar el proceso de recuperación.
            </p>

            {/* Contenedor de Inputs con un gap moderado para que quepa el error */}
            <div className="flex flex-col gap-4 mb-6">
              <Input
                htmlFor="password"
                name="password"
                variant="tertiary"
                type="password"
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                error={errors.password}
              />

              <Input
                htmlFor="confirmPassword"
                name="confirmPassword"
                variant="tertiary"
                type="password"
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                error={errors.confirmPassword}
              />
            </div>

            <div className="flex justify-center mb-5">
              <Button
                variant="primary"
                type="submit"
                size="md"
              >
                Renovar contraseña
              </Button>
            </div>

            <p
              className="text-center text-medium font-medium-custom cursor-pointer text-brand hover:underline"
              onClick={() => navigate("/login")}
            >
              Volver al inicio de sesión
            </p>

          </div>
        </form>
      </div>
    </section>
  );
}

export default NewPassword;