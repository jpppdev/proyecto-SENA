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
    <aside
      id="dashboard-sidebar"
      className={`${collapsed ? "w-16 px-2" : "w-52 px-2.5"} flex min-h-[436px] rounded-[32px] bg-linear-to-b from-brand to-brand-hover pb-6 pt-[27px] text-text-success shadow-md transition-[width] duration-300 motion-reduce:transition-none`}
    >

      {/* Navegación */}
      <nav aria-label="Menú lateral" className="flex w-full flex-col gap-1.5">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <NavLink
              key={module.path}
              title={collapsed ? module.name : undefined}
              aria-label={module.name}
              to={module.path}
              className={({ isActive }) =>
                `flex min-h-12 min-w-12 items-center ${collapsed ? "w-12 justify-center" : "w-full gap-3 px-3"} overflow-hidden rounded-[17px]
                transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-success
                ${
                  isActive
                    ? "bg-background-div text-text-brand shadow-sm"
                    : "text-text-success hover:bg-background-div/20"
                }`
              }
            >
              <Icon size={24} className="shrink-0" aria-hidden="true" />

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