import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { readSessionPayload } from "@/features/auth/session";
import { getMyPermissions } from "../services/permissionServices";

const EMPTY_PERMISSIONS = {
  users: [],
  inventory: [],
  orders: [],
  menu: [],
  providers: [],
};

const PermissionsContext = createContext({
  loading: true,
  user: null,
  permissions: EMPTY_PERMISSIONS,
  isAdmin: false,
  can: () => false,
  refreshPermissions: async () => {},
});

export function PermissionsProvider({ children }) {
  const [state, setState] = useState(() => {
    const payload = readSessionPayload();
    return {
      loading: true,
      user: payload
        ? {
            id: payload.id,
            userName: payload.name || payload.email || "Usuario",
            userEmail: payload.email || "",
            roleName: payload.roleName || (payload.isSuperUser ? "administrador" : "usuario"),
            isSuperUser: Boolean(payload.isSuperUser),
          }
        : null,
      permissions: EMPTY_PERMISSIONS,
    };
  });

  const refreshPermissions = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setState({ loading: false, user: null, permissions: EMPTY_PERMISSIONS });
      return;
    }

    try {
      const data = await getMyPermissions();
      setState({
        loading: false,
        user: data.user || null,
        permissions: {
          ...EMPTY_PERMISSIONS,
          ...(data.permissions || {}),
        },
      });
    } catch {
      const payload = readSessionPayload();
      const isAdminFallback = Boolean(
        payload?.isSuperUser || payload?.roleName === "administrador"
      );
      setState({
        loading: false,
        user: payload
          ? {
              id: payload.id,
              userName: payload.name || payload.email || "Usuario",
              userEmail: payload.email || "",
              roleName: payload.roleName || (isAdminFallback ? "administrador" : "usuario"),
              isSuperUser: isAdminFallback,
            }
          : null,
        permissions: isAdminFallback
          ? {
              users: ["view", "create", "edit", "delete"],
              inventory: ["view", "create", "edit", "delete"],
              orders: ["view", "create", "edit", "delete"],
              menu: ["view", "create", "edit", "delete"],
              providers: ["view", "create", "edit", "delete"],
            }
          : EMPTY_PERMISSIONS,
      });
    }
  }, []);

  useEffect(() => {
    refreshPermissions();
    window.addEventListener("permissions:updated", refreshPermissions);
    return () => window.removeEventListener("permissions:updated", refreshPermissions);
  }, [refreshPermissions]);

  const isAdmin = Boolean(
    state.user?.isSuperUser ||
      String(state.user?.roleName || "").toLowerCase() === "administrador"
  );

  const can = useCallback(
    (moduleId, action = "view") => {
      if (isAdmin) return true;
      if (state.loading) return false;
      const modulePerms = state.permissions?.[moduleId];
      if (Array.isArray(modulePerms)) {
        return modulePerms.includes(action);
      }
      return false;
    },
    [state.loading, state.permissions, isAdmin]
  );

  return (
    <PermissionsContext.Provider
      value={{
        loading: state.loading,
        user: state.user,
        permissions: state.permissions,
        isAdmin,
        can,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
