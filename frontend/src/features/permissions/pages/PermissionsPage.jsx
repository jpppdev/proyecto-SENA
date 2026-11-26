import { useState, useEffect } from "react";
import { Button } from "@/shared";
import { Users, Package, ShoppingCart, Coffee, Store } from "lucide-react";
import { showSuccessAlert, showErrorAlert } from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import {
    getPermissionsData,
    saveRolePermissions,
    saveUserPermissions,
} from "../services/permissionServices";
import { getUsers } from "@/features/users/services/userServices";
import PermissionsHeader from "../components/PermissionsHeader";
import PermissionsFilters from "../components/PermissionsFilters";
import PermissionModuleCard from "../components/PermissionModuleCard";

const fallbackRoles = [
    { label: "Administrador (Acceso Total)", value: "administrador" },
    { label: "Mesero", value: "mesero" },
    { label: "Empleado", value: "empleado" },
    { label: "Cajero", value: "cajero" },
    { label: "Usuario Normal", value: "usuario" }
];

const permissionModules = [
    {
        id: "users",
        name: "Módulo de Usuarios",
        icon: <Users size={20} />,
        actions: [
            { key: "view", label: "Ver usuarios" },
            { key: "create", label: "Crear usuarios" },
            { key: "edit", label: "Editar usuarios" },
            { key: "delete", label: "Eliminar usuarios" }
        ]
    },
    {
        id: "inventory",
        name: "Módulo de Inventario",
        icon: <Package size={20} />,
        actions: [
            { key: "view", label: "Ver inventario" },
            { key: "create", label: "Crear productos" },
            { key: "edit", label: "Editar productos" },
            { key: "delete", label: "Eliminar productos" }
        ]
    },
    {
        id: "orders",
        name: "Módulo de Órdenes",
        icon: <ShoppingCart size={20} />,
        actions: [
            { key: "view", label: "Ver órdenes" },
            { key: "create", label: "Crear órdenes" },
            { key: "edit", label: "Editar/Cambiar estado" },
            { key: "delete", label: "Eliminar/Cancelar órdenes" }
        ]
    },
    {
        id: "menu",
        name: "Módulo de Menú",
        icon: <Coffee size={20} />,
        actions: [
            { key: "view", label: "Ver platillos" },
            { key: "create", label: "Agregar al menú" },
            { key: "edit", label: "Editar platillos" },
            { key: "delete", label: "Eliminar platillos" }
        ]
    },
    {
        id: "providers",
        name: "Módulo de Proveedores",
        icon: <Store size={20} />,
        actions: [
            { key: "view", label: "Ver proveedores" },
            { key: "create", label: "Registrar proveedores" },
            { key: "edit", label: "Editar proveedores" },
            { key: "delete", label: "Eliminar proveedores" }
        ]
    }
];

const defaultPermissions = {
    administrador: {
        users: ["view", "create", "edit", "delete"],
        inventory: ["view", "create", "edit", "delete"],
        orders: ["view", "create", "edit", "delete"],
        menu: ["view", "create", "edit", "delete"],
        providers: ["view", "create", "edit", "delete"]
    },
    mesero: {
        users: [],
        inventory: ["view"],
        orders: ["view", "create", "edit"],
        menu: ["view"],
        providers: []
    },
    empleado: {
        users: [],
        inventory: ["view"],
        orders: ["view", "create", "edit"],
        menu: ["view"],
        providers: ["view"]
    },
    cajero: {
        users: [],
        inventory: ["view"],
        orders: ["view", "create", "edit"],
        menu: ["view"],
        providers: []
    },
    usuario: {
        users: [],
        inventory: [],
        orders: ["view", "create"],
        menu: ["view"],
        providers: []
    }
};

export default function PermissionsPage() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState(fallbackRoles);
    const [selectedRole, setSelectedRole] = useState("administrador");
    const [permissions, setPermissions] = useState(defaultPermissions);

    // Estado para usuarios de la base de datos y permisos especificos por usuario
    const [dbUsers, setDbUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [userPermissions, setUserPermissions] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // 1. Cargamos los usuarios directamente desde la base de datos usando el servicio de usuarios
        getUsers()
            .then((usersData) => {
                if (Array.isArray(usersData)) {
                    setDbUsers(usersData);
                }
            })
            .catch((error) => {
                console.error("Error cargando usuarios desde BD:", error);
            });

        // 2. Cargamos roles y permisos configurados en la base de datos
        getPermissionsData()
            .then((data) => {
                if (data.roles && data.roles.length > 0) {
                    setRoles(data.roles);
                }
                if (data.rolePermissions && Object.keys(data.rolePermissions).length > 0) {
                    setPermissions((prev) => ({
                        ...prev,
                        ...data.rolePermissions
                    }));
                }
                if (Array.isArray(data.users) && data.users.length > 0) {
                    setDbUsers(data.users);
                }
                if (data.userPermissions) {
                    setUserPermissions(data.userPermissions);
                }
            })
            .catch((error) => {
                console.error("Error cargando roles y permisos desde BD:", error);
            });
    }, []);

    // Opciones del Select de usuarios de la BD
    const userOptions = dbUsers.map((u) => ({
        value: String(u.id),
        label: `${u.userName || ""} ${u.userLastname || ""}`.trim() +
            (u.userEmail ? ` (${u.userEmail})` : "") +
            (u.roleName ? ` — Rol: ${u.roleName}` : "")
    }));

    // Permisos activos en pantalla (del usuario seleccionado o del rol seleccionado)
    const activePermissions = selectedUserId
        ? userPermissions[selectedUserId] || permissions[selectedRole] || {}
        : permissions[selectedRole] || {};

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        if (!newRole) return;
        setSelectedRole(newRole);

        // Si hay un usuario seleccionado, cargamos la plantilla del nuevo rol para ese usuario
        if (selectedUserId) {
            const roleTemplate = permissions[newRole] || defaultPermissions[newRole] || {};
            setUserPermissions((prev) => ({
                ...prev,
                [selectedUserId]: {
                    users: [...(roleTemplate.users || [])],
                    inventory: [...(roleTemplate.inventory || [])],
                    orders: [...(roleTemplate.orders || [])],
                    menu: [...(roleTemplate.menu || [])],
                    providers: [...(roleTemplate.providers || [])]
                }
            }));
        }
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        if (!userId) return;

        const foundUser = dbUsers.find((u) => String(u.id) === String(userId));
        const userRole = foundUser?.roleName || selectedRole;
        setSelectedRole(userRole);

        // Si el usuario aun no tiene permisos especificos en memoria, inicializamos con los de su rol
        setUserPermissions((prev) => {
            if (prev[userId] && Object.keys(prev[userId]).length > 0) {
                return prev;
            }
            const baseRolePerms = permissions[userRole] || defaultPermissions[userRole] || {};
            return {
                ...prev,
                [userId]: {
                    users: [...(baseRolePerms.users || [])],
                    inventory: [...(baseRolePerms.inventory || [])],
                    orders: [...(baseRolePerms.orders || [])],
                    menu: [...(baseRolePerms.menu || [])],
                    providers: [...(baseRolePerms.providers || [])]
                }
            };
        });
    };

    const handlePermissionToggle = (moduleId, actionKey) => {
        if (selectedUserId) {
            setUserPermissions((prev) => {
                const currentPerms = prev[selectedUserId]?.[moduleId] || activePermissions[moduleId] || [];
                const hasPermission = currentPerms.includes(actionKey);
                const updatedModulePerms = hasPermission
                    ? currentPerms.filter((key) => key !== actionKey)
                    : [...currentPerms, actionKey];

                return {
                    ...prev,
                    [selectedUserId]: {
                        ...(prev[selectedUserId] || activePermissions),
                        [moduleId]: updatedModulePerms
                    }
                };
            });
        } else {
            setPermissions((prev) => {
                const rolePerms = prev[selectedRole]?.[moduleId] || [];
                const hasPermission = rolePerms.includes(actionKey);

                const updatedModulePerms = hasPermission
                    ? rolePerms.filter((key) => key !== actionKey)
                    : [...rolePerms, actionKey];

                return {
                    ...prev,
                    [selectedRole]: {
                        ...prev[selectedRole],
                        [moduleId]: updatedModulePerms
                    }
                };
            });
        }
    };

    const handleSelectAllModule = (moduleId, selectAll) => {
        const allActions = permissionModules.find((m) => m.id === moduleId).actions.map((a) => a.key);

        if (selectedUserId) {
            setUserPermissions((prev) => ({
                ...prev,
                [selectedUserId]: {
                    ...(prev[selectedUserId] || activePermissions),
                    [moduleId]: selectAll ? allActions : []
                }
            }));
        } else {
            setPermissions((prev) => ({
                ...prev,
                [selectedRole]: {
                    ...prev[selectedRole],
                    [moduleId]: selectAll ? allActions : []
                }
            }));
        }
    };

    const handleSavePermissions = async () => {
        setIsSubmitting(true);
        try {
            if (selectedUserId) {
                const currentUser = dbUsers.find((u) => String(u.id) === String(selectedUserId));
                const permsToSave = userPermissions[selectedUserId] || activePermissions;
                await saveUserPermissions(selectedUserId, permsToSave, selectedRole);

                // Actualizamos el rol del usuario en la lista local
                setDbUsers((prev) =>
                    prev.map((u) =>
                        String(u.id) === String(selectedUserId)
                            ? { ...u, roleName: selectedRole }
                            : u
                    )
                );

                await showSuccessAlert({
                    title: "Permisos de usuario actualizados",
                    text: `Se guardaron en la base de datos los permisos específicos para ${currentUser?.userName || "el usuario"} (Rol: ${selectedRole}).`,
                    timer: 2500
                });
            } else {
                const roleLabel = roles.find((r) => r.value === selectedRole)?.label || selectedRole;
                await saveRolePermissions(selectedRole, permissions[selectedRole]);

                await showSuccessAlert({
                    title: "Permisos del rol actualizados",
                    text: `Los permisos para el rol ${roleLabel} han sido guardados en la base de datos.`,
                    timer: 2500
                });
            }
        } catch (error) {
            await showErrorAlert({
                title: "Error al guardar",
                text: error.message || "No se pudieron guardar los permisos en la base de datos."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedUserObj = dbUsers.find((u) => String(u.id) === String(selectedUserId));

    return (
        <div className="relative w-full max-w-[1200px] min-h-[600px] mx-auto mt-10 text-text-primary">
            <PermissionsHeader />

            <div className="bg-background-div/30 backdrop-blur-md rounded-[2.5rem] shadow-md border border-border/40 p-8 md:p-10">
                <PermissionsFilters
                    roles={roles}
                    selectedRole={selectedRole}
                    onRoleChange={handleRoleChange}
                    userOptions={userOptions}
                    selectedUserId={selectedUserId}
                    onUserChange={handleUserChange}
                    onClearUser={() => setSelectedUserId("")}
                    selectedUserObj={selectedUserObj}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {permissionModules.map((module) => (
                        <PermissionModuleCard
                            key={module.id}
                            module={module}
                            currentModulePerms={activePermissions[module.id] || []}
                            onTogglePermission={handlePermissionToggle}
                            onSelectAllModule={handleSelectAllModule}
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-12 border-t-2 border-border-strong pt-8">
                    <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        variant="secondary"
                        size="md"
                        className="rounded-xl border-border-strong text-text-primary hover:bg-background-div/40 transition-all"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSavePermissions}
                        disabled={isSubmitting}
                        variant="primary"
                    >
                        {isSubmitting ? "GUARDANDO..." : "GUARDAR PERMISOS"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
