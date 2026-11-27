
import { useState } from "react";
import logo from "@/assets/images/1-logo.png";
import {
  UserRound,
  Bell,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";

import { Link, useNavigate } from "react-router-dom";
import { showErrorAlert, showDeleteAlert } from "@/shared/services/alertService";

import { logout } from "@/features/auth/schemas/logoutService";
import { readSessionPayload } from "@/features/auth/session";
import { usePermissions } from "@/features/permissions";

const navLinkClass = "text-sm font-semibold text-[#713008] transition-colors hover:text-orange-600";

export default function Navbar() {
  const navigate = useNavigate();
  const userId = Number(readSessionPayload()?.id);
  const { user, isAdmin, can } = usePermissions();
  const canViewOrders = can("orders", "view");
  const displayName = user?.userName || (isAdmin ? "Admin" : "Usuario");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

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

  const handleLogout = async () => {
    const result = await showDeleteAlert({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir de tu cuenta?",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });
    
    if (result.isConfirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav aria-label="Navegación superior" className="relative z-50 w-full bg-[linear-gradient(105deg,#f9e8cf_0%,#fff3e6_55%,#ffe3bd_100%)] text-[#713008]">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-2 sm:gap-4">
          <div className="flex h-full w-[104px] shrink-0 items-center overflow-hidden sm:w-44">
            <img
              src={logo}
              alt="Restaurante Aurum"
              width={1536}
              height={1024}
              className="h-[72px] w-auto max-w-none shrink-0 -translate-x-3 translate-y-1 sm:h-[82px]"
            />
          </div>

          {/* Enlaces de navegación */}
          <ul className="hidden shrink-0 items-center gap-5 xl:flex">
            {isAdmin && (
              <li>
                <Link
                  to="/dashboard/home"
                  className={navLinkClass}
                >
                  Panel
                </Link>
              </li>
            )}

            {canViewOrders && (
              <li>
                <Link to="/dashboard/orders" className={navLinkClass}>
                  Órdenes
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/dashboard/Dishes"
                className={navLinkClass}
              >
                Platillos
              </Link>
            </li>

            <li>
              <Link to="/dashboard/tables" className={navLinkClass}>
                Mesas
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                onClick={handleContactClick}
                className={navLinkClass}
              >
                Contacto
              </Link>
            </li>
          </ul>

          {/* Botones de acciones */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <div className="flex h-[60px] items-center gap-1 border-x border-[#efc19f] px-2 sm:gap-[26px] sm:px-5">
              {/* Modo claro y oscuro */}
              <IconButton
                onClick={handleTheme}
                className="text-[#713008]! hover:bg-white/70!"
                ariaLabel={
                  darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
                hitSize={44}
                iconSize={22}
              >
                {darkMode ? <Sun /> : <Moon />}
              </IconButton>

              {/* Notificaciones */}
              <IconButton
                onClick={handleNotifications}
                className="text-[#713008]! hover:bg-white/70!"
                ariaLabel="Ver notificaciones"
                hitSize={44}
                iconSize={22}
              >
                <Bell />
              </IconButton>
            </div>

            {/* Menú de usuario */}
            <Dropdown className="z-50">
              <DropdownTrigger>
                <button
                  type="button"
                  aria-label="Abrir menú de usuario"
                  className="inline-flex items-center gap-4 rounded-full p-0.5 text-base font-bold text-[#713008] hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-orange-600"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-[linear-gradient(145deg,#c87521,#a4470a)] text-white sm:h-12 sm:w-12"><UserRound size={28} aria-hidden="true" /></span>
                  <span className="hidden sm:inline">{displayName}</span>
                  <ChevronDown size={16} className="hidden sm:block" aria-hidden="true" />
                </button>
              </DropdownTrigger>

              <DropdownContent className="right-0 border-orange-100 bg-[#fff8f1]! text-[#713008]! [&_button:hover]:bg-orange-100">

                {canViewOrders && (
                  <DropdownItem asChild className="xl:hidden!">
                    <Link to="/dashboard/orders">Órdenes</Link>
                  </DropdownItem>
                )}

                <DropdownItem asChild className="xl:hidden!">
                  <Link to="/dashboard/Dishes">Platillos</Link>
                </DropdownItem>

                <DropdownItem asChild className="xl:hidden!">
                  <Link to="/dashboard/tables">Mesas</Link>
                </DropdownItem>

                {Number.isSafeInteger(userId) && userId > 0 && (
                  <DropdownItem asChild>
                    <Link to={`/dashboard/userView/${userId}`} className="block w-full">
                      Mi Perfil
                    </Link>
                  </DropdownItem>
                )}

                {isAdmin && (
                  <DropdownItem asChild>
                    <Link to="/dashboard/permissions" className="block w-full">
                      Gestion de Permisos
                    </Link>
                  </DropdownItem>
                )}

                <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>

              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
}
