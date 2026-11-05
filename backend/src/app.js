// Importamos Express, el frameWoek base para construir el servidor HTTP
import express from "express";

// Importamos el middleware CORS
// Permite controlar que origines pueden comunicarse con el backend
import cors from "cors";

// Importamos las rutas del feature users
// cada feature expone su propio router independiente
import userRoutes from "./features/users/user.routes.js";
import authRoutes from './features/auth/auth.routes.js';
import orderRoutes from "./features/order/order.routes.js";
import providerRoutes from "./features/provider/provider.routes.js";
import inventoryRoutes from "./features/inventory/inventory.routes.js";
import menuRoutes from "./features/menu/menu.routes.js";
import productRoutes from "./features/products/product.routes.js";
import permissionRoutes from "./features/permissions/permission.routes.js";

// Creamos la instancia de la aplicacion Express
const app = express();

// MIddleware de CORS
// Permite solicitudes unicamiente desde el frontend en localhost:5173
//(tipico proyecto Vite en desarrollo)
app.use(cors({ origin: "http://localhost:5173"}));

// Middleware para parsear el cuerpo de las peticiones como JSON
//Sin este middleware, req, body, seria undefined
app.use(express.json());

// Registro del router de usuarios
//Todas las rutas del feature users quedaran bajo el prefijo/api/users
//Ejemplo final: POST http://localhost:4000/api/users
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/products", productRoutes);
app.use("/api/permissions", permissionRoutes);

// Exportamos la aplicacion configurada
// EL arranque del servidor se hace en server.js
export default app;
