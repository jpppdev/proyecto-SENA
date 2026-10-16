import { Link } from "react-router-dom";
import logo from "@/assets/images/1-logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-white/20 backdrop-blur-md relative z-50">
      <div className="mx-auto max-w-7xl px-4">

        {/* Contenido del footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8">

          {/* Logo de marca */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Link to="/dashboard">
              <img
                src={logo}
                alt="logo"
                className="h-28 w-auto"
              />
            </Link>

            <p className="text-body text-text-primary text-center sm:text-left">
              Tu lugar favorito para disfrutar de una buena comida.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-medium font-medium-custom text-text-primary">
              Enlaces rápidos
            </h3>

            <Link
              to="/Home"
              className="text-body text-text-primary"
            >
              Inicio
            </Link>

            <Link
              to="/dashboard/Dishes"
              className="text-body text-text-primary"
            >
              Platillos
            </Link>
          </div>

          {/* Información de contacto */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h3 className="text-medium font-medium-custom text-text-primary">
              Contacto
            </h3>

            <p className="text-body text-text-primary">
              ¿Tienes alguna pregunta?
            </p>

            <Link
              to="/Home"
              className="text-body text-text-primary"
            >
              Visítanos
            </Link>
          </div>

        </div>

        {/* Derechos reservados */}
        <div className="border-t border-border py-4">
          <p className="text-body text-text-primary text-center">
            © {new Date().getFullYear()} Restaurante. Todos los derechos
            reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
