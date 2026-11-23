import logo from "@/assets/images/1-logo.png";
import { NavLink } from "react-router-dom";
import {
  Users,
  Truck,
  Utensils,
  ClipboardList,
  Package,
} from "lucide-react";

export default function Sidebar({ collapsed = false }) {

  const modules = [
    {
      name: "Usuarios",
      path: "/dashboard/userList",
      icon: Users,
    },
    {
      name: "Proveedores",
      path: "/dashboard/providerList",
      icon: Truck,
    },
    {
      name: "Menú",
      path: "/dashboard/menuList",
      icon: Utensils,
    },
    {
      name: "Órdenes",
      path: "/dashboard/orderList",
      icon: ClipboardList,
    },
    {
      name: "Inventario",
      path: "/dashboard/inventoryList",
      icon: Package,
    },
  ];

  return (
    <aside id="dashboard-sidebar" aria-label="Menú lateral" className={`${collapsed ? "w-[72px]" : "w-[238px]"} h-full min-h-screen bg-[linear-gradient(163deg,#ff8b13_0%,#ff6800_23%,#c84200_57%,#ff6800_100%)] border-r border-white/20 p-3 text-white transition-[width] duration-300 motion-reduce:transition-none`}>

      <NavLink to="/dashboard" aria-label="Aurum — Inicio" className="mb-5 flex h-24 items-center justify-center border-b border-white/20 pb-3 focus-visible:outline-2 focus-visible:outline-white">
        <img src={logo} alt="Restaurante Aurum" className={`${collapsed ? "w-12" : "w-40"} max-h-20 object-contain transition-[width] duration-300 motion-reduce:transition-none`} />
      </NavLink>
      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <NavLink
              key={module.path}
              title={collapsed ? module.name : undefined}
              aria-label={module.name}
              to={module.path}
              className={({ isActive }) =>
                `flex min-h-11 items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} rounded-lg py-2
                transition-colors duration-300
                ${
                  isActive
                    ? "bg-[linear-gradient(110deg,rgba(255,177,58,.95),rgba(255,142,35,.9))] text-white"
                    : "text-white hover:bg-[linear-gradient(110deg,rgba(255,177,58,.95),rgba(255,142,35,.9))]"
                }`
              }
            >
              <Icon size={22} className="shrink-0" aria-hidden="true" />

              <span className={collapsed ? "sr-only" : "text-body whitespace-nowrap"}>
                {module.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
