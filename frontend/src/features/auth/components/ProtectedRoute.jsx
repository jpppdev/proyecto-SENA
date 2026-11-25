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
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    sessionStorage.removeItem("token");
    return false;
  }
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

  return <Outlet />;
}

// Rutas públicas (login, recuperar contraseña): si ya hay sesión, va al dashboard
export function PublicRoute() {
  if (hasValidToken()) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <Outlet />;
}