// backend/src/features/uploads/upload.routes.js
import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ROOT = path.resolve(__dirname, "../../../uploads");

const ALLOWED_MODULES = new Set(["users", "menu", "providers", "inventory"]);
const MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const router = Router();

router.post("/:module", async (req, res) => {
  try {
    const moduleName = String(req.params.module || "").trim().toLowerCase();
    if (!ALLOWED_MODULES.has(moduleName)) {
      return res.status(400).json({ error: "Módulo de carga no permitido." });
    }

    const { mimeType = "", dataBase64 = "" } = req.body || {};
    let resolvedMime = String(mimeType).trim().toLowerCase();
    let base64Payload = String(dataBase64).trim();

    const dataUrlMatch = base64Payload.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (dataUrlMatch) {
      resolvedMime = resolvedMime || dataUrlMatch[1].toLowerCase();
      base64Payload = dataUrlMatch[2];
    }

    const ext = MIME_TO_EXT[resolvedMime];
    if (!ext) {
      return res.status(400).json({
        error: "Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.",
      });
    }

    if (!base64Payload) {
      return res.status(400).json({ error: "No se recibió el archivo de imagen." });
    }

    const buffer = Buffer.from(base64Payload, "base64");
    if (!buffer.length || buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({
        error: "La imagen excede el tamaño máximo permitido (10 MB) o está vacía.",
      });
    }

    const moduleDir = path.join(UPLOADS_ROOT, moduleName);
    await fs.mkdir(moduleDir, { recursive: true });

    const savedFileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const filePath = path.join(moduleDir, savedFileName);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${moduleName}/${savedFileName}`;
    const publicUrl = `${req.protocol}://${req.get("host")}${publicPath}`;

    return res.status(201).json({
      message: "Imagen guardada correctamente",
      url: publicUrl,
      path: publicPath,
      fileName: savedFileName,
    });
  } catch (err) {
    console.error("ERROR EN UPLOAD:", err);
    return res.status(500).json({ error: "No se pudo guardar la imagen en el servidor." });
  }
});

export default router;
