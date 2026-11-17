// frontend/src/features/auth/components/ProtectedRoute.jsx
// Guardias de rutas basadas en el JWT guardado en sessionStorage

import { Navigate, Outlet, useLocation } from "react-router-dom";

// Verifica si existe un token válido y no expirado
function hasValidToken() {
  const token = sessionStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return false;
  }

  try {
    // El payload del JWT es la segunda parte (base64url)
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    // exp viene en segundos; si ya expiró, se elimina el token
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    // Token mal formado
    sessionStorage.removeItem("token");
    return false;
  }
}

// Rutas privadas: si no hay sesión, redirige al login
export function ProtectedRoute() {
  const location = useLocation();

  if (!hasValidToken()) {
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

