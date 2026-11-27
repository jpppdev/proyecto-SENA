// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";   
import { DashboardLayout } from "@/shared";
import { UserListPage, UserRegisterForm, ViewUser} from "@/features/users";
import  Login  from "@/features/auth/components/Login";
import  ForgotPassword  from "@/features/auth/components/ForgotPassword";
import  ResetPasswordToken  from "@/features/auth/components/ResetPasswordToken";
import  NewPassword  from "@/features/auth/components/NewPassword";
import DishesPage from "@/features/products/pages/DishesPage";
import TablesPage from "@/features/tables/pages/TablesPage";
import { InventoryCreateForm, InventoryEditForm } from "../features/inventory";
import { ProviderRegisterForm } from "../features/provider";

// CORRECCIÓN: Importamos todo desde el archivo index de 'orders' en plural, manteniendo el estándar de barril
import { OrderBoardPage, OrderListPage, ViewOrder, OrderCreateForm } from "@/features/order";

import { InventoryListPage } from "@/features/inventory";
import { ViewInventory } from "@/features/inventory";
import { ViewSuppliers } from "@/features/provider";
import { ProviderListPage } from "@/features/provider";
import { MenuCreateForm, ViewMenu, MenuListPage } from "@/features/menu";


import { UserEditForm } from "../features/users";
import { OrderEditForm } from "../features/order";
import MenuEditForm from "../features/menu/components/MenuEditForm";
import ProviderEditForm from "../features/provider/components/ProviderEditForm";

import { AdminHomePage } from "../features/home";
import { PermissionsPage } from "@/features/permissions";
import { ProtectedRoute, PublicRoute, PermissionGuard } from "@/features/auth/components/ProtectedRoute";


const  router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace/>
    },

    // --- MÓDULO: AUTENTICACIÓN (solo accesible SIN sesión) ---
    {
    element: <PublicRoute />,
    children: [
    // Login
    {
        path: "/login",
        element: <Login />,
    },
    
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
    },

    {
        path: "/resetPasswordToken",
        element: <ResetPasswordToken />,
    },

    {
        path: "/newPassword",
        element: <NewPassword />,
    },
    ],
    },

    // --- RUTAS PROTEGIDAS (requieren sesión iniciada) ---
    {
    element: <ProtectedRoute />,
    children: [
    {
        path: "/Home",
        element: <Navigate to="/dashboard/home" replace />,
    },

    {
        path: "/dashboard",
        element : <DashboardLayout/>,
        children: [
            { index: true, element: <Navigate to="/dashboard/Dishes" replace /> },
            // Vistas predeterminadas para cualquier usuario autenticado (Platillos y Mesas)
            { path: "Dishes", element: <DishesPage />},
            { path: "tables", element: <TablesPage /> },

            // --- PANEL Y PERMISOS (solo administrador) ---
            {
                element: <PermissionGuard adminOnly />,
                children: [
                    { path: "home", element: <AdminHomePage /> },
                    { path: "permissions", element: <PermissionsPage /> },
                ],
            },

            // --- USUARIOS ---
            {
                element: <PermissionGuard module="users" action="view" />,
                children: [
                    { path: "userList", element: <UserListPage /> },
                ],
            },
            {
                element: <PermissionGuard module="users" action="view" allowOwnProfile />,
                children: [
                    { path: "userView/:id", element: <ViewUser /> },
                ],
            },
            {
                element: <PermissionGuard module="users" action="create" />,
                children: [
                    { path: "userCreate", element: <UserRegisterForm /> },
                ],
            },
            {
                element: <PermissionGuard module="users" action="edit" />,
                children: [
                    { path: "users/:id/edit", element: <UserEditForm /> },
                    { path: "userEdit/:id", element: <UserEditForm /> },
                ],
            },

            // --- ÓRDENES ---
            {
                element: <PermissionGuard module="orders" action="view" />,
                children: [
                    { path: "orderList", element: <OrderListPage /> },
                    { path: "orders", element: <OrderBoardPage /> },
                    { path: "orderView/:id", element: <ViewOrder /> },
                ],
            },
            {
                element: <PermissionGuard module="orders" action="create" />,
                children: [
                    { path: "orderCreate", element: <OrderCreateForm /> },
                ],
            },
            {
                element: <PermissionGuard module="orders" action="edit" />,
                children: [
                    { path: "orders/:id/edit", element: <OrderEditForm /> },
                ],
            },

            // --- INVENTARIO ---
            {
                element: <PermissionGuard module="inventory" action="view" />,
                children: [
                    { path: "inventoryList", element: <InventoryListPage /> },
                    { path: "ViewInventory/:id", element: <ViewInventory /> },
                ],
            },
            {
                element: <PermissionGuard module="inventory" action="create" />,
                children: [
                    { path: "inventoryCreate", element: <InventoryCreateForm /> },
                ],
            },
            {
                element: <PermissionGuard module="inventory" action="edit" />,
                children: [
                    { path: "inventory/:id/edit", element: <InventoryEditForm /> },
                ],
            },

            // --- PROVEEDORES ---
            {
                element: <PermissionGuard module="providers" action="view" />,
                children: [
                    { path: "providerList", element: <ProviderListPage /> },
                    { path: "ViewSuppliers/:id", element: <ViewSuppliers /> },
                ],
            },
            {
                element: <PermissionGuard module="providers" action="create" />,
                children: [
                    { path: "providerCreate", element: <ProviderRegisterForm /> },
                ],
            },
            {
                element: <PermissionGuard module="providers" action="edit" />,
                children: [
                    { path: "providerEdit/:id", element: <ProviderEditForm /> },
                ],
            },

            // --- MENÚ ---
            {
                element: <PermissionGuard module="menu" action="view" />,
                children: [
                    { path: "menuList", element: <MenuListPage /> },
                    { path: "ViewMenu/:id", element: <ViewMenu /> },
                ],
            },
            {
                element: <PermissionGuard module="menu" action="create" />,
                children: [
                    { path: "menuCreate", element: <MenuCreateForm /> },
                    { path: "addmenu", element: <MenuCreateForm /> },
                ],
            },
            {
                element: <PermissionGuard module="menu" action="edit" />,
                children: [
                    { path: "menuEdit/:id", element: <MenuEditForm /> },
                ],
            },
        ],
    },
    ],
    },

    // Cualquier ruta inexistente redirige al inicio
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;
