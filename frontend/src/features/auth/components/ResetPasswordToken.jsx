import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import tokenPassword from "../../../assets/images/TokenPassword.png";
import title from "../../../assets/images/Img-Titulo.png";
import { resetPasswordTokenSchema } from "../schemas/ResetPasswordTokenSchema";

function ResetPasswordToken() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setToken(e.target.value);

    setErrors({
      ...errors,
      token: undefined,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const result = resetPasswordTokenSchema.safeParse({
    token,
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

      <div className="relative z-10 w-[1000px] h-[600px] bg-[var(--white)] rounded-4xl shadow-2xl flex overflow-hidden">

        <div className="w-1/2 flex items-center justify-center">
          <img
            src={tokenPassword}
            alt="Restaurante"
            className="w-[85%] h-[85%] object-contain"
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

          <h1 className="text-main text-[var(--color-text-secondary)] text-center mb-4">
            Verificar token
          </h1>

          <p className="text-body text-[var(--color-text-secondary)] text-center mb-8">
            Ingresa el código que enviamos a tu correo electrónico
            para continuar con la recuperación de tu contraseña.
          </p>

          <Input
            htmlFor="token"
            name="token"
            type="text"
            label="Token"
            placeholder="Ingresa el token"
            value={token}
            onChange={handleChange}
            error={errors.token}
          />

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
              className="text-medium font-[var(--font-weight-bold)] cursor-pointer text-[var(--color-brand)]"
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
