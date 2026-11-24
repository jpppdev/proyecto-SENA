import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Navbar, Sidenav, Footer } from "@/shared";

export default function DashboardLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full flex-col overflow-x-clip bg-[radial-gradient(ellipse_at_43%_18%,#fffbf8_0%,#fff7f0_65%,#fff2e8_100%)]"
    >
      <Navbar />

      <div className="flex flex-1">
        <div className="sticky top-0 z-40 flex h-[calc(100dvh-72px)] min-h-[452px] shrink-0 items-center self-start py-2 pr-2">
          <div
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
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

