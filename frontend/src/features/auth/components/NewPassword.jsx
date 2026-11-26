import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import newPassword from "../../../assets/images/NewPassword.png";
import title from "../../../assets/images/1-logo.png";
import { newPasswordSchema } from "../schemas/NewPasswordSchema";
import { resetPassword } from "../schemas/authService";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

function NewPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
    setIsSubmitting(true);

    try {
      const email = sessionStorage.getItem("resetEmail") || "";
      const token = sessionStorage.getItem("resetToken") || "";

      if (!token) {
        await showCancelAlert({
          title: "Token no encontrado",
          text: "Por favor solicita y verifica nuevamente tu código de recuperación.",
          timer: 2500,
        });
        navigate("/forgotPassword");
        return;
      }

      const response = await resetPassword({
        email,
        token,
        password: result.data.password,
      });

      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetToken");

      await showSuccessAlert({
        title: "Contraseña cambiada",
        text: response.message || "Tu contraseña fue cambiada con éxito.",
        timer: 2500,
      });

      navigate("/login");
    } catch (error) {
      console.error("Error al restablecer contraseña:", error.message);
      await showCancelAlert({
        title: "Error al cambiar contraseña",
        text: error.message || "No se pudo actualizar la contraseña.",
        timer: 2500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      {/* Tarjeta responsiva */}
      <div className="relative z-10 grid w-full max-w-md overflow-hidden rounded-2xl bg-background-div shadow-2xl md:min-h-[600px] md:max-w-[1000px] md:grid-cols-2 md:rounded-4xl">
        {/* Imagen */}
        <div className="relative hidden md:block">
          <img
            src={newPassword}
            alt="Restaurante Aurum"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex min-w-0 flex-col items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-14"
        >
          <img
            src={title}
            alt="Restaurante Aurum"
            className="mb-4 w-36 sm:mb-6 sm:w-48"
          />

          <h1 className="text-main font-title font-heading text-text-negative text-center mb-3 sm:mb-4">
            Renovar Contraseña
          </h1>

          <p className="text-body text-text-secondary text-center mb-6 sm:mb-8">
            Ingresa y confirma tu nueva contraseña para
            completar el proceso de recuperación.
          </p>

          <Input
            htmlFor="password"
            name="password"
            variant="tertiary"
            type="password"
            size="lg"
            autoComplete="new-password"
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

          <div className="mt-3 flex w-full justify-center">
            <Input
              htmlFor="confirmPassword"
              name="confirmPassword"
              variant="tertiary"
              type="password"
              size="lg"
              autoComplete="new-password"
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

          <div className="mt-6 flex w-full justify-center sm:mt-8">
            <Button
              variant="primary"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Renovar contraseña"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link
              className="inline-flex min-h-11 items-center text-medium font-medium-custom text-text-brand hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring"
              to="/login"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewPassword;