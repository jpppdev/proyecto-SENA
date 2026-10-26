
import { useState } from "react";
import {
  Menu,
  UserRound,
  Bell,
  Sun,
  Moon,
  ChevronDown,
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
    <nav aria-label="Navegación superior" className="relative z-50 w-full bg-[linear-gradient(105deg,#f9e8cf_0%,#fff3e6_55%,#ffe3bd_100%)] text-[#713008]">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-2 sm:h-20 sm:gap-4">

          <IconButton
            onClick={onMenuClick}
            ariaLabel="Abrir o cerrar menú lateral"
            hitSize={44}
            iconSize={22}
            className="shrink-0 text-[#a14d0b]! hover:bg-white/60!"
          >
            <Menu />
          </IconButton>

          {/* Logo */}
          <div className="hidden shrink-0 items-center xl:flex">
            <Link to="/dashboard" className="text-h1 font-heading">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>

          {/* Enlaces de navegación */}
          <ul className="hidden shrink-0 items-center gap-5 xl:flex">
            <li>
              <Link
                to="/Home"
                className="text-sm font-semibold text-[#713008] transition-colors hover:text-orange-600"
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/Dishes"
                className="text-sm font-semibold text-[#713008] transition-colors hover:text-orange-600"
              >
                Platillos
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                onClick={handleContactClick}
                className="text-sm font-semibold text-[#713008] transition-colors hover:text-orange-600"
              >
                Contacto
              </Link>
            </li>
          </ul>

          {/* Buscador */}
          <div className="mr-auto min-w-0 max-w-[510px] flex-1">
            <SearchField
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              onClear={handleClear}
              placeholder="Buscar en el sistema..."
              ariaLabel="Buscar en el sistema"
              size="md"
              variant="outlined"
              className="h-11! w-full rounded-2xl! border-orange-100! bg-white/85! text-[#713008] hover:border-orange-300! focus-within:ring-orange-300! sm:h-[49px]! [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:placeholder:text-[#977d6e] [&>svg]:text-[#d96502]!"
            />
          </div>

          {/* Botones de acciones */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">

            {/* Modo claro y oscuro */}
            <IconButton
              onClick={handleTheme}
              className="text-[#713008]! hover:bg-white/70!"
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
              className="bg-white/70 text-[#713008]! hover:bg-white!"
              ariaLabel="Ver notificaciones"
              hitSize={44}
              iconSize={20}
            >
              <Bell />
            </IconButton>

            {/* Menú de usuario */}
            <Dropdown className="z-50">
              <DropdownTrigger>
                <button
                  type="button"
                  aria-label="Abrir menú de usuario"
                  className="inline-flex items-center gap-3 rounded-full p-1 text-sm font-bold text-[#713008] hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-orange-600"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-[linear-gradient(145deg,#c87521,#a4470a)] text-white"><UserRound size={26} aria-hidden="true" /></span>
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown size={16} className="hidden sm:block" aria-hidden="true" />
                </button>
              </DropdownTrigger>

              <DropdownContent className="right-0 border-orange-100 bg-[#fff8f1]! text-[#713008]! [&_button:hover]:bg-orange-100">
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
