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
    <aside className="w-52 min-h-screen bg-white/30 backdrop-blur-md border-r border-border p-3">

      {/* Encabezado */}
      <div className="mb-5 border-b border-border pb-3">
        <h2 className="text-title font-heading text-text-primary">
          Módulos
        </h2>

        <p className="mt-1 text-small text-text-secondary">
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
                    ? "bg-brand text-text-inverse"
                    : "text-text-primary hover:bg-brand-soft-hover hover:text-text-primary"
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