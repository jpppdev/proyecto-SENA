import { useState } from "react";
import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/fondo.png";

import { Navbar, Sidenav, Footer } from "@/shared";

export default function DashboardLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full flex-col overflow-x-hidden"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar
        onMenuClick={() => setSidenavOpen(!sidenavOpen)}
      />

      <div className="flex flex-1 min-w-0">
        {sidenavOpen && (
          <div className="relative z-40 shrink-0">
            <Sidenav />
          </div>
        )}

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

