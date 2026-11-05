import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import logo from "../../../assets/images/Img-Login.jpeg";
import title from "../../../assets/images/Img-Titulo.png";
import { loginSchema } from "../schemas/LoginSchema";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    navigate("/home");
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      <div className="relative z-10 w-[1000px] h-[600px] bg-background-div rounded-4xl shadow-2xl flex overflow-hidden">

        <div className="w-1/2">
          <img
            src={logo}
            alt="Restaurante"
            className="w-full h-full object-cover"
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="w-1/2 flex flex-col justify-center items-center px-14"
        >
          <img
            src={title}
            alt="Title"
            className="w-48 mx-auto mb-6"
          />

          <h1 className="text-main font-heading text-text-negative text-center mb-6">
            Bienvenido
          </h1>

          <Input
            variant="tertiary"
            htmlFor="email"
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="mt-2">
            <Input
              variant="tertiary"
              htmlFor="password"
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <div className="w-full mt-8 flex justify-center">
            <Button
              variant="primary"
              type="submit"
              size="md"
            >
              Iniciar Sesión
            </Button>
          </div>

          <p className="text-body text-text-secondary text-center mt-6">
            ¿Aún no tienes una cuenta?{" "}
            <span
              className="text-medium font-medium-custom cursor-pointer text-brand"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </span>
          </p>

          <div className="text-center mt-6 mb-6">
            <p
              className="text-medium font-medium-custom cursor-pointer text-brand"
              onClick={() => navigate("/forgotPassword")}
            >
              ¿Olvidaste tu contraseña?
            </p>
          </div>
        </form>

      </div>
    </section>
  );
}

export default Login;