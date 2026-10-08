import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import tokenPassword from "../../../assets/images/TokenPassword.png";
import title from "../../../assets/images/Img-Titulo.png";
import { resetPasswordTokenSchema } from "../schemas/ResetPasswordTokenSchema";

function ResetPasswordToken() {
  const navigate = useNavigate();

  const [token, setToken] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
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

    navigate("/newPassword");
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      <div className="relative z-10 w-[1000px] h-[600px] bg-background-div rounded-4xl shadow-2xl flex overflow-hidden">

        <div className="w-1/2 flex items-center justify-center">
          <img
            src={tokenPassword}
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
            Verificar token
          </h1>

          <p className="text-body text-text-secondary text-center mb-8">
            Ingresa el código que enviamos a tu correo electrónico
            para continuar con la recuperación de tu contraseña.
          </p>

          <div className="flex justify-center gap-4">

            {token.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-title font-heading border border-border-clear rounded-xl bg-background-input text-text-secondary focus:border-brand focus:outline-none"
              />
            ))}

          </div>

          {errors.token && (
            <p className="text-small text-error mt-3 text-center">
              {errors.token[0]}
            </p>
          )}

          <div className="w-full mt-8 flex justify-center">
            <Button
              variant="primary"
              type="submit"
              size="md"
            >
              Verificar token
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

export default ResetPasswordToken;

