// // frontend/src/features/auth/components/ProtectedRoute.jsx
// // Guardias de rutas basadas en el JWT guardado en sessionStorage

// import { Navigate, Outlet, useLocation } from "react-router-dom";

// // Verifica si existe un token válido y no expirado
// function hasValidToken() {
//   const token = sessionStorage.getItem("token");

//   if (!token || token === "null" || token === "undefined") {
//     return false;
//   }

//   try {
//     // El payload del JWT es la segunda parte (base64url)
//     const payload = JSON.parse(
//       atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
//     );

//     // exp viene en segundos; si ya expiró, se elimina el token
//     if (payload.exp && payload.exp * 1000 < Date.now()) {
//       sessionStorage.removeItem("token");
//       return false;
//     }

//     return true;
//   } catch {
//     // Token mal formado
//     sessionStorage.removeItem("token");
//     return false;
//   }
// }

// // Rutas privadas: si no hay sesión, redirige al login
// export function ProtectedRoute() {
//   const location = useLocation();

//   if (!hasValidToken()) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// }

// // Rutas públicas (login, recuperar contraseña): si ya hay sesión, va al dashboard
// export function PublicRoute() {
//   if (hasValidToken()) {
//     return <Navigate to="/dashboard/home" replace />;
//   }

//   return <Outlet />;
// }

import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { readSessionPayload } from "../session";
import { PermissionsProvider, usePermissions } from "@/features/permissions";
import {
  showInactivityWarningAlert,
  showSessionExpiredAlert,
} from "@/shared/services/alertService";

// Verifica si existe un token válido y no expirado
function hasValidToken() {
  const token = sessionStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return false;
  }

  const payload = readSessionPayload();
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    sessionStorage.removeItem("token");
    return false;
  }
  return true;
}

// Rutas privadas: si no hay sesión, redirige al login
export function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = hasValidToken();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Tiempos de prueba (para producción usa: 15 * 60 * 1000 y 60 * 1000)
    const TIEMPO_TOTAL = 15 * 60 * 1000; // 15 minutos (900.000 ms)
    const TIEMPO_ALERTA = 60 * 1000;     // Alerta 1 minuto antes (60.000 ms)

    let warningTimer;
    let isWarningOpen = false;

    const cerrarSesion = async () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      await showSessionExpiredAlert();
      navigate("/login", { replace: true });
    };

    const reiniciarTemporizador = () => {
      // Si la alerta ya está en pantalla, mover el mouse hacia el botón no la cancela
      if (isWarningOpen) return;

      clearTimeout(warningTimer);

      warningTimer = setTimeout(async () => {
        isWarningOpen = true;

        const result = await showInactivityWarningAlert({
          timer: TIEMPO_ALERTA,
        });

        isWarningOpen = false;

        if (result.isConfirmed) {
          reiniciarTemporizador();
        } else {
          await cerrarSesion();
        }
      }, TIEMPO_TOTAL - TIEMPO_ALERTA);
    };

    const eventos = ["mousemove", "keydown", "click", "scroll"];
    eventos.forEach((ev) => window.addEventListener(ev, reiniciarTemporizador));

    reiniciarTemporizador();

    return () => {
      clearTimeout(warningTimer);
      if (isWarningOpen) Swal.close();
      eventos.forEach((ev) => window.removeEventListener(ev, reiniciarTemporizador));
    };
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <PermissionsProvider>
      <Outlet />
    </PermissionsProvider>
  );
}

// Guardia por rol y permisos de módulo (por defecto todos acceden a Platillos y Mesas)
export function PermissionGuard({
  module,
  action = "view",
  adminOnly = false,
  allowOwnProfile = false,
}) {
  const { id } = useParams();
  const { loading, user, isAdmin, can } = usePermissions();

  if (isAdmin) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-text-secondary">
        Cargando permisos...
      </div>
    );
  }

  if (allowOwnProfile && id && user?.id && String(id) === String(user.id)) {
    return <Outlet />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard/Dishes" replace />;
  }

  if (module && !can(module, action)) {
    return <Navigate to="/dashboard/Dishes" replace />;
  }

  return <Outlet />;
}

// Rutas públicas (login, recuperar contraseña): si ya hay sesión, va a su vista inicial según rol
export function PublicRoute() {
  if (hasValidToken()) {
    const payload = readSessionPayload();
    const isAdmin = Boolean(
      payload?.isSuperUser || String(payload?.roleName || "").toLowerCase() === "administrador"
    );
    return <Navigate to={isAdmin ? "/dashboard/home" : "/dashboard/Dishes"} replace />;
  }

  return <Outlet />;
}
