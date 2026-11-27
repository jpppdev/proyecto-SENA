import { API_URL } from "@/features/config";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo de imagen."));
    reader.readAsDataURL(file);
  });
}

/**
 * Sube un archivo File al backend (POST /api/uploads/:module) y devuelve la URL pública.
 */
export async function uploadImage(file, moduleName) {
  const token = sessionStorage.getItem("token");
  const dataBase64 = await readFileAsDataUrl(file);

  const headers = {
    "Content-Type": "application/json",
  };
  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/uploads/${moduleName}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      dataBase64,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al subir la imagen al servidor");
  }

  const data = await response.json();
  return data.url;
}

/**
 * Si el campo contiene un File (o [File]), lo sube al backend y devuelve la URL resultante.
 * Si ya es una URL en texto, la devuelve tal cual; de lo contrario retorna null.
 */
export async function resolveImageUpload(imageValue, moduleName) {
  if (!imageValue) return null;

  if (typeof File !== "undefined") {
    if (imageValue instanceof File) {
      return await uploadImage(imageValue, moduleName);
    }
    if (Array.isArray(imageValue) && imageValue[0] instanceof File) {
      return await uploadImage(imageValue[0], moduleName);
    }
  }

  if (typeof imageValue === "string" && imageValue.trim()) {
    return imageValue.trim();
  }

  return null;
}
