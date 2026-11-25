export function readSessionPayload() {
  try {
    const token = sessionStorage.getItem("token");
    const encoded = token?.split(".")[1];
    if (!encoded) return null;

    return JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
