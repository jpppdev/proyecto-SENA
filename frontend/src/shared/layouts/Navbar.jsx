import { useState } from "react";
import {
  Menu,
  UserRound,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import {
  IconButton,
  SearchField,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";
import logo from "@/assets/images/1-logo.png";
import { Link } from "react-router-dom";
import { showErrorAlert } from "@/shared/services/alertService";

export default function Navbar({ onMenuClick }) {
  // Componente de búsqueda 😂😂😂
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  const handleContactClick = (e) => {
    e.preventDefault();

    showErrorAlert({
      title: "Error inesperado",
      text: "Ha ocurrido un error inesperado al acceder a Contacto.",
      timer: 2500,
    });
  };

  // Cambiar entre modo claro y oscuro
  const handleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  // Mostrar notificaciones
  const handleNotifications = () => {
    showErrorAlert({
      title: "Notificaciones",
      text: "No tienes notificaciones nuevas.",
      timer: 2500,
    });
  };

  return (
  <nav className="w-full bg-white/30 backdrop-blur-md relative z-50">
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex h-16 items-center justify-between gap-4">

        {/* Logo de marca */}
        <div className="hidden sm:block items-center">
          <Link to="/dashboard" className="text-h1 font-heading">
            <img src={logo} alt="logo" className="h-12" />
          </Link>
        </div>

        {/* Links de navegación */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link
              to="/Home"
              className="text-text-primary hover:text-text-brand transition-colors"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/Dishes"
              className="text-text-primary hover:text-text-brand transition-colors"
            >
              Platillos
            </Link>
          </li>

          <li>
            <Link
              onClick={handleContactClick}
              className="text-text-primary hover:text-text-brand transition-colors"
            >
              Contacto
            </Link>
          </li>
        </ul>

        {/* Buscador */}
        <div className="flex-1 max-w-xs">
          <SearchField
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            onClear={handleClear}
            placeholder="Buscar productos..."
            size="md"
            variant="outlined"
            className="w-full"
          />
        </div>

        {/* Iconos de acciones */}
        <div className="flex items-center gap-2">

          <Dropdown className="z-50">
            <DropdownTrigger>
              <IconButton onClick={onMenuClick}>
                <Menu size={20} />
              </IconButton>
            </DropdownTrigger>

            
</Dropdown>

          {/* Modo claro y oscuro */}
          <IconButton onClick={handleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* Notificaciones */}
          <IconButton onClick={handleNotifications}>
            <Bell size={20} />
          </IconButton>

          {/* Menú de usuario */}
          <Dropdown className="z-50">
            <DropdownTrigger>
              <IconButton>
                <UserRound size={20} />
              </IconButton>
            </DropdownTrigger>

            <DropdownContent>
              <DropdownItem>
                <Link to="/dashboard/userList" className="block w-full">
                  Módulo usuario
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/dashboard/inventoryList" className="block w-full">
                  Módulo inventario
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/dashboard/providerList" className="block w-full">
                  Módulo proveedor
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/dashboard/menuList" className="block w-full">
                  Módulo menú
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/dashboard/orderList" className="block w-full">
                  Módulo órdenes
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/login" className="block w-full">
                  Cerrar sesión
                </Link>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

        </div>
      </div>
    </div>
  </nav>
    );
}