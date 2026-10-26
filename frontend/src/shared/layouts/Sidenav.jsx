import { NavLink } from "react-router-dom";
import {
  Users,
  Truck,
  Utensils,
  ClipboardList,
  Package,
} from "lucide-react";

export default function Sidebar() {

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
    <aside className="w-52 min-h-screen bg-[linear-gradient(163deg,#ffa932_0%,#ee8115_27%,#cf6207_67%,#bd5100_100%)] border-r border-white/20 p-3 text-white">

      {/* Encabezado */}
      <div className="mb-5 border-b border-white/20 pb-3">
        <h2 className="text-title font-heading text-white">
          Módulos
        </h2>

        <p className="mt-1 text-small text-orange-100">
          Restaurante Aurum
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <NavLink
              key={module.path}
              to={module.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2
                transition-colors duration-300
                ${
                  isActive
                    ? "bg-[linear-gradient(110deg,rgba(255,193,95,.65),rgba(255,146,37,.67))] text-white"
                    : "text-white hover:bg-[linear-gradient(110deg,rgba(255,193,95,.65),rgba(255,146,37,.67))]"
                }`
              }
            >
              <Icon size={18} />

              <span className="text-body">
                {module.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
