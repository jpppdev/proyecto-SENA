import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Navbar, Sidenav, Footer } from "@/shared";

export default function DashboardLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_43%_18%,#fffbf8_0%,#fff7f0_65%,#fff2e8_100%)]"
    >
        <div
          className="relative z-40 shrink-0"
          onMouseEnter={() => setSidenavOpen(true)}
          onMouseLeave={() => setSidenavOpen(false)}
          onFocus={() => setSidenavOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setSidenavOpen(false);
            }
          }}
        >
          <Sidenav collapsed={!sidenavOpen} />
        </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

