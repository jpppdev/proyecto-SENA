// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";   
import { AuthLayout, DashboardLayout, } from "@/shared";
import { UserListPage, UserRegisterForm, ViewUser} from "@/features/users";
import  Login  from "@/features/auth/components/Login";
import  ForgotPassword  from "@/features/auth/components/ForgotPassword";
import  ResetPasswordToken  from "@/features/auth/components/ResetPasswordToken";
import  NewPassword  from "@/features/auth/components/NewPassword";
import DishesPage from "@/features/products/pages/DishesPage";
import { InventoryCreateForm, InventoryEditForm } from "../features/inventory";
import { ProviderRegisterForm } from "../features/provider";

// CORRECCIÓN: Importamos todo desde el archivo index de 'orders' en plural, manteniendo el estándar de barril
import { OrderListPage, ViewOrder, OrderCreateForm } from "@/features/order";

import { InventoryListPage } from "@/features/inventory";
import { ViewInventory } from "@/features/inventory";
import { ViewSuppliers } from "@/features/provider";
import { ProviderListPage } from "@/features/provider";
import { MenuCreateForm, ViewMenu, MenuListPage } from "@/features/menu";


import { UserEditForm } from "../features/users";
import { OrderEditForm } from "../features/order";
import MenuEditForm from "../features/menu/components/MenuEditForm";
import ProviderEditForm from "../features/provider/components/ProviderEditForm";

import { HomePage } from "../features/home";


const  router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard/home" replace/>
    },

    // --- MÓDULO: AUTENTICACIÓN ---
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

    {
        path: "/Home",
        element: <DashboardLayout/>,
        children:[
            {
                index: true,
                element: <HomePage/>
            },
        ],
    },

    {
        path: "/dashboard",
        element : <DashboardLayout/>,
        children: [
            {index: true},
            { path: "home", element: <HomePage />},
            { path: "Dishes", element: <DishesPage />},
            
            // --- USUARIOS ---
{ path: "userList", element: <UserListPage />},
{ path: "userCreate", element: <UserRegisterForm />},
{ path: "userView/:id", element: <ViewUser /> }, 
{ path: "users/:id/edit", element: <UserEditForm /> },
{ path: "userEdit/:id", element: <UserEditForm /> }, 

            // --- ÓRDENES ---
            { path: "orderList", element: <OrderListPage /> },
            { path: "orderCreate", element: <OrderCreateForm /> },
            { path: "orderView/:id", element: <ViewOrder /> },
            { path: "orders/:id/edit", element: <OrderEditForm /> }, // Reemplazar con OrderEditForm cuando exista

            // --- INVENTARIO ---
            { path: "inventoryList", element: <InventoryListPage />},
            { path: "inventoryCreate", element: <InventoryCreateForm />},
            { path: "ViewInventory/:id", element: <ViewInventory /> },
            { path: "inventory/:id/edit", element: <InventoryEditForm /> },

            // --- PROVEEDORES ---
            { path: "providerList", element: <ProviderListPage/> },
            { path: "providerCreate", element: <ProviderRegisterForm />},
            { path: "ViewSuppliers/:id", element: < ViewSuppliers />},
            { path: "providerEdit/:id", element: < ProviderEditForm />},

            // --- MENÚ ---
            { path: "menuList", element: <MenuListPage /> },
            { path: "menuCreate", element: <MenuCreateForm /> },
            { path: "addmenu", element: <MenuCreateForm />}, // Si es duplicado, revisa si necesitas ambas
            { path: "ViewMenu/:id", element: <ViewMenu /> },
            { path: "menuEdit/:id", element: <MenuEditForm /> },
        ],
    },
]);

export default router;