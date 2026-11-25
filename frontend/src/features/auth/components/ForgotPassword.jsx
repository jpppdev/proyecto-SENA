import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      {/* Tarjeta */}
      <div className="relative z-10 w-[1000px] h-[600px] bg-background-div rounded-4xl shadow-2xl flex overflow-hidden">

        {/* Imagen */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={savePassword}
            alt="Restaurante"
            className="w-full h-full object-cover"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-1/2 flex flex-col justify-center items-center px-14"
        >

          <img
            src={title}
            alt="Title"
            className="w-48 mx-auto mb-6"
          />


          <h1 className="text-main font-heading text-text-negative text-center mb-6">
            Recuperar Contraseña
          </h1>

          <p className="text-body text-text-secondary text-center mb-8">
            Ingresa tu correo electrónico y te enviaremos
            un enlace para recuperar tu contraseña.
          </p>

          <Input
            htmlFor="email"
            variant="tertiary"
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="w-full mt-8 flex justify-center">
            <Button
              variant="primary"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando código..." : "Recuperar contraseña"}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p
              className="text-medium font-medium-custom cursor-pointer text-brand"
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

export default ForgotPassword;