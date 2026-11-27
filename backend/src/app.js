// Importamos Express, el frameWoek base para construir el servidor HTTP
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
import tableRoutes from "./features/tables/table.routes.js";
import uploadRoutes from "./features/uploads/upload.routes.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";
import { sqlInjectionGuard } from "./middlewares/security.middleware.js";

// Creamos la instancia de la aplicacion Express
const app = express();

// MIddleware de CORS
// Vite puede usar 5174 cuando 5173 ya esta ocupado.
app.use(cors({ origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]}));

// Middleware para parsear el cuerpo de las peticiones como JSON
//Sin este middleware, req, body, seria undefined
app.use(express.json({ limit: "15mb" }));

// Servir archivos de imágenes guardados en backend/uploads
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Protección global contra inyecciones SQL en query, params y body
app.use(sqlInjectionGuard);

// Registro del router de usuarios
//Todas las rutas del feature users quedaran bajo el prefijo/api/users
//Ejemplo final: POST http://localhost:4000/api/users
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/products", productRoutes);
app.use("/api/permissions", authenticateToken, permissionRoutes);
app.use("/api/tables", authenticateToken, tableRoutes);
app.use("/api/uploads", authenticateToken, uploadRoutes);

// Exportamos la aplicacion configurada
// EL arranque del servidor se hace en server.js
export default app;
