import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import savePassword from "../../../assets/images/SavePassword.png";
import title from "../../../assets/images/1-logo.png";
import { forgotPasswordSchema } from "../schemas/ForgotPasswordSchema";
import { requestPasswordReset } from "../schemas/authService";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);

    setErrors({
      ...errors,
      email: undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({
      email,
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(result.data.email);

      sessionStorage.setItem("resetEmail", response.email || result.data.email);

      await showSuccessAlert({
        title: "Código Enviado",
        text: response.message || "Enviamos un código de 4 dígitos a tu correo.",
        timer: 2500,
      });

      navigate("/resetPasswordToken");
    } catch (error) {
      console.error("Error en recuperación de contraseña:", error.message);
      await showCancelAlert({
        title: "Error al enviar el código",
        text: error.message || "No se pudo enviar el código de recuperación.",
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

      {/* Tarjeta */}
      <div className="relative z-10 grid w-full max-w-md overflow-hidden rounded-2xl bg-background-div shadow-2xl md:min-h-[600px] md:max-w-[1000px] md:grid-cols-2 md:rounded-4xl">
        {/* Imagen */}
        <div className="relative hidden md:block">
          <img
            src={savePassword}
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
            Recuperar Contraseña
          </h1>

          <p className="text-body text-text-secondary text-center mb-6 sm:mb-8">
            Ingresa tu correo electrónico y te enviaremos
            un enlace para recuperar tu contraseña.
          </p>

          <Input
            htmlFor="email"
            variant="tertiary"
            name="email"
            type="email"
            size="lg"
            autoComplete="email"
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="mt-6 flex w-full justify-center sm:mt-8">
            <Button
              variant="primary"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando código..." : "Recuperar contraseña"}
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

export default ForgotPassword;