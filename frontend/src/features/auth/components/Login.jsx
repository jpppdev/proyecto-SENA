import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import logo from "../../../assets/images/Img-Login.png";
import title from "../../../assets/images/1-logo.png";
import { loginSchema } from "../schemas/LoginSchema";
import { login } from "../schemas/authService";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleLogin = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const data = await login(result.data);

      sessionStorage.setItem("token", data.token);

      const isAdmin = Boolean(
        data?.user?.isSuperUser ||
          String(data?.user?.roleName || "").toLowerCase() === "administrador"
      );

      // Metemos un sweetaler dentro del try que avisara que se pudo iniciar sesion correctamente 
      await showSuccessAlert({
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al sistema",
        timer: 1500,
      });

      navigate(isAdmin ? "/dashboard/home" : "/dashboard/Dishes");

    } catch (error) {
      console.error("Error en login:", error.message);

      // lo mismo hacemos en el cath por si llega a fallar y no encuentra el usuario o la contraseña es incorrecta
      await showCancelAlert({
        title: "Error al iniciar sesión",
        text: error.message || "Credenciales incorrectas",
        timer: 2000,
      });
    }
  };

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${restaurante})` }}
      ></div>

      <div className="relative z-10 grid w-full max-w-md overflow-hidden rounded-2xl bg-background-div shadow-2xl md:min-h-[600px] md:max-w-[1000px] md:grid-cols-2 md:rounded-4xl">

        <div className="relative hidden md:block">
          <img
            src={logo}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="flex min-w-0 flex-col items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-14"
        >
          <img
            src={title}
            alt="Restaurante Aurum"
            className="mb-4 w-36 sm:mb-6 sm:w-48"
          />

          <h1 className="text-main font-title font-heading text-text-negative text-center mb-6">
            Bienvenido
          </h1>

          <Input
            variant="tertiary"
            htmlFor="email"
            name="email"
            type="email"
            size="lg"
            autoComplete="username"
            label="Correo electrónico"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <div className="mt-3 flex w-full justify-center">
            <Input
              variant="quaternary"
              htmlFor="password"
              name="password"
              type="password"
              size="lg"
              autoComplete="current-password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <div className="mt-6 flex w-full justify-center sm:mt-8">
            <Button
              variant="primary"
              type="submit"
              size="md"
            >
              Iniciar Sesión
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link
              className="inline-flex min-h-11 items-center text-medium font-medium-custom text-text-brand hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring"
              to="/forgotPassword"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

      </div>
    </section>
  );
}

export default Login;
