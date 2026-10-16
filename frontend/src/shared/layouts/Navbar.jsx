
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
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );


export default function Navbar() {

  // Componente de búsqueda
  const [search, setSearch] = useState("");


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

    <nav className="relative z-50 w-full bg-white/30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <div className="hidden items-center sm:flex">
            <Link to="/dashboard" className="text-h1 font-heading">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>

          {/* Enlaces de navegación */}
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Link
                to="/Home"
                className="text-text-primary transition-colors hover:text-text-brand"
              >

    <nav className="w-full bg-white/20 backdrop-blur-md relative z-50">

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-28 items-center justify-between">

          {/* Logo de marca */}
          <div className="hidden sm:block items-center">
            <Link to="/dashboard" className="text-h1 font-heading">
              <img src={logo} alt="logo" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link to="/Home" className="text-text-primary">

                Inicio
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/Dishes"

                className="text-text-primary transition-colors hover:text-text-brand"

                className="text-text-primary"

              >
                Platillos
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                onClick={handleContactClick}

                className="text-text-primary transition-colors hover:text-text-brand"

                className="text-text-primary"

              >
                Contacto
              </Link>
            </li>
          </ul>


          {/* Buscador */}
          <div className="max-w-xs flex-1">

          {/* SearchField + IconButton */}
          <div>

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

          {/* Botones de acciones */}
          <div className="flex items-center gap-2">

            {/* Abrir y cerrar Sidenav */}
            <IconButton
              onClick={onMenuClick}
              ariaLabel="Abrir o cerrar menú lateral"
              hitSize={44}
              iconSize={20}
            >
              <Menu />
            </IconButton>

            {/* Modo claro y oscuro */}
            <IconButton
              onClick={handleTheme}
              ariaLabel={
                darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
              }
              hitSize={44}
              iconSize={20}
            >
              {darkMode ? <Sun /> : <Moon />}
            </IconButton>

            {/* Notificaciones */}
            <IconButton
              onClick={handleNotifications}
              ariaLabel="Ver notificaciones"
              hitSize={44}
              iconSize={20}
            >
              <Bell />
            </IconButton>

            {/* Menú de usuario */}
            <Dropdown className="z-50">
              <DropdownTrigger>
                <IconButton
                  ariaLabel="Abrir menú de usuario"
                  hitSize={44}
                  iconSize={20}
                >
                  <UserRound />

              className="w-76"
            />
          </div>

          {/* Dropdown */}
          <div>
            <Dropdown className="z-50">
              <DropdownTrigger>
                <IconButton>
                  <Menu />

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

                    Módulo orden

                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/login" className="block w-full">
                    Cerrar sesión
                  </Link>
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
 feat-component-sidenav

          </div>


          </div>
        </div>
      </div>
    </nav>
  );
}
