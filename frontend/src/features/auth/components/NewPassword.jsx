import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import newPassword from "../../../assets/images/NewPassword.png";
import title from "../../../assets/images/Img-Titulo.png";
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

      {/* Tarjeta */}
      <div className="relative z-10 w-[1000px] h-[600px] bg-[var(--white)] rounded-4xl shadow-2xl flex overflow-hidden">

        {/* Imagen */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={newPassword}
            alt="Restaurante"
            className="w-[85%] h-[85%] object-contain"
          />
        </div>

        {/* Formulario */}
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
            Renovar contraseña
          </h1>

          <p className="text-body text-[var(--color-text-secondary)] text-center mb-8">
            Ingresa y confirma tu nueva contraseña para
            completar el proceso de recuperación.
          </p>

          
<div className="w-1/2 flex flex-col justify-center items-center">
  <Input
    htmlFor="password"
    name="password"
    type="password"
    label="Nueva contraseña"
    placeholder="Ingresa tu nueva contraseña"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      setErrors({
        ...errors,
        password: undefined,
      });
    }}
    error={errors.password}
  />

  <div className="mt-4">
    <Input
      htmlFor="confirmPassword"
      name="confirmPassword"
      type="password"
      label="Confirmar contraseña"
      placeholder="Confirma tu nueva contraseña"
      value={confirmPassword}
      onChange={(e) => {
        setConfirmPassword(e.target.value);
        setErrors({
          ...errors,
          confirmPassword: undefined,
        });
      }}
      error={errors.confirmPassword}
    />
  </div>
</div>



          <div className="w-full mt-8 flex justify-center">
            <Button
              variant="primary"
              type="submit"
              size="md"
            >
              Renovar contraseña
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

export default NewPassword;

