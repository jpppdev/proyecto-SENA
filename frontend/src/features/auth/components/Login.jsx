import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import restaurante from "../../../assets/images/Img-Restaurante.jpeg";
import logo from "../../../assets/images/Img-Login.jpeg";
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
      console.log("LOGIN RESPONSE:", data);

      sessionStorage.setItem("token", data.token);

      // Metemos un sweetaler dentro del try que avisara que se pudo iniciar sesion correctamente 
      await showSuccessAlert({
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al sistema",
        timer: 1500,
      });

      navigate("/dashboard/home");

    } catch (error) {
      console.error("Error en login:", error.message);

      // lo mismo hacemos en el cath por si llega a fallar y no encuentra el usuario o la contraseña es incorrecta
      await showCancelAlert({
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas",
        timer: 2000,
      });
    }
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
              variant="quaternary"
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