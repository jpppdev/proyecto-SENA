import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import tokenPassword from "../../../assets/images/TokenPassword.png";
import title from "../../../assets/images/1-logo.png";
import { resetPasswordTokenSchema } from "../schemas/ResetPasswordTokenSchema";
import { verifyResetToken } from "../schemas/authService";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

function ResetPasswordToken() {
  const navigate = useNavigate();

  const [token, setToken] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newToken = [...token];
    newToken[index] = value.slice(-1);

    setToken(newToken);

    setErrors({
      ...errors,
      token: undefined,
    });

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenValue = token.join("");

    const result = resetPasswordTokenSchema.safeParse({
      token: tokenValue,
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const email = sessionStorage.getItem("resetEmail") || "";
      const response = await verifyResetToken({
        email,
        token: tokenValue,
      });

      if (response.email) {
        sessionStorage.setItem("resetEmail", response.email);
      }
      sessionStorage.setItem("resetToken", tokenValue);

      await showSuccessAlert({
        title: "Código verificado",
        text: "El código es válido. Ahora puedes ingresar tu nueva contraseña.",
        timer: 2000,
      });

      navigate("/newPassword");
    } catch (error) {
      console.error("Error al verificar token:", error.message);
      await showCancelAlert({
        title: "Código inválido",
        text: error.message || "El código ingresado es inválido o ha expirado.",
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
        <div className="relative hidden md:flex items-center justify-center">
          <img
            src={tokenPassword}
            alt="Restaurante Aurum"
            className="h-full w-full object-contain"
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
            Verificar Token
          </h1>

          <p className="text-body text-text-secondary text-center mb-6 sm:mb-8">
            Ingresa el código que enviamos a tu correo electrónico
            para continuar con la recuperación de tu contraseña.
          </p>

          <div className="flex justify-center gap-2.5 sm:gap-4">
            {token.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                aria-label={`Dígito ${index + 1}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 sm:h-14 sm:w-14 text-center text-title font-title font-heading border border-border-clear rounded-xl bg-background-input text-text-primary focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              />
            ))}
          </div>

          {errors.token && (
            <p className="text-small text-error mt-3 text-center">
              {errors.token[0]}
            </p>
          )}

          <div className="mt-6 flex w-full justify-center sm:mt-8">
            <Button
              variant="primary"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verificando..." : "Verificar token"}
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

export default ResetPasswordToken;