import { useState } from "react";
import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/fondo.png";
import { Navbar, Sidenav } from "@/shared";

export default function DashboardLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar
        onMenuClick={() => setSidenavOpen(!sidenavOpen)}
      />

      <div className="flex min-w-0">
        {sidenavOpen && (
          <div className="relative z-40 shrink-0">
            <Sidenav />
          </div>
        )}

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
