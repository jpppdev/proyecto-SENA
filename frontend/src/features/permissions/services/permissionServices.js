import { API_URL } from "@/features/config";

const PERMISSIONS_URL = `${API_URL}/permissions`;
const ROLE_PERMS_STORAGE_KEY = "aurum_role_permissions";
const USER_PERMS_STORAGE_KEY = "aurum_user_permissions";

export async function getPermissionsData() {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(PERMISSIONS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        roles: null,
        rolePermissions: JSON.parse(localStorage.getItem(ROLE_PERMS_STORAGE_KEY) || "null"),
        userPermissions: JSON.parse(localStorage.getItem(USER_PERMS_STORAGE_KEY) || "{}"),
      };
    }

    const data = await response.json();
    if (data.rolePermissions) {
      localStorage.setItem(ROLE_PERMS_STORAGE_KEY, JSON.stringify(data.rolePermissions));
    }
    if (data.userPermissions) {
      localStorage.setItem(USER_PERMS_STORAGE_KEY, JSON.stringify(data.userPermissions));
    }
    return data;
  } catch {
    return {
      roles: null,
      rolePermissions: JSON.parse(localStorage.getItem(ROLE_PERMS_STORAGE_KEY) || "null"),
      userPermissions: JSON.parse(localStorage.getItem(USER_PERMS_STORAGE_KEY) || "{}"),
    };
  }
}

export async function saveRolePermissions(roleName, permissions) {
  const token = sessionStorage.getItem("token");
  const storedRoles = JSON.parse(localStorage.getItem(ROLE_PERMS_STORAGE_KEY) || "{}");
  storedRoles[roleName] = permissions;
  localStorage.setItem(ROLE_PERMS_STORAGE_KEY, JSON.stringify(storedRoles));

  try {
    const response = await fetch(`${PERMISSIONS_URL}/role/${roleName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      return { roleName, permissions };
    }

    return await response.json();
  } catch {
    return { roleName, permissions };
  }
}

export async function saveUserPermissions(userId, permissions, roleName) {
  const token = sessionStorage.getItem("token");
  const storedUsers = JSON.parse(localStorage.getItem(USER_PERMS_STORAGE_KEY) || "{}");
  storedUsers[String(userId)] = permissions;
  localStorage.setItem(USER_PERMS_STORAGE_KEY, JSON.stringify(storedUsers));

  try {
    const response = await fetch(`${PERMISSIONS_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ permissions, roleName }),
    });

    if (!response.ok) {
      return { userId, roleName, permissions };
    }

    return await response.json();
  } catch {
    return { userId, roleName, permissions };
  }
}
