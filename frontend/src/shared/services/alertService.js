// src/shared/services/alertService.js
import Swal from "sweetalert2";

export function showSuccessAlert({
  title = "Éxito",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 1000,
} = {}) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "text-green-600",
      confirmButton: "bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg",
    },

    buttonsStyling: false,
  });
}

export function showErrorAlert({
  title = "Error",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 1000,
} = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "text-red-600",
      confirmButton: "bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg",
    },

    buttonsStyling: false,
  });
}
export function showDisableAlert({
  title = "¿Estás seguro?",
  text = "El registro quedará deshabilitado en el sistema",
  confirmButtonText = "Sí, deshabilitar",
  cancelButtonText = "Cancelar",
} = {}) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: "rounded-2xl",
      title: "text-red-600 font-bold",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg ml-2 transition-colors",
      cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors",
    },
    buttonsStyling: false,
  });
}

export function showCancelDisableAlert({
  title = "Deshabilitación cancelada",
  text = "La deshabilitación fue cancelada.",
  confirmButtonText = "Aceptar",
  timer = 2000,
} = {}) {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "text-blue-600 font-bold",
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg",
    },

    buttonsStyling: false,
  });
}

export function showConfirmDisableAlert({
  title = "Registro deshabilitado",
  text = "El registro fue deshabilitado correctamente.",
  confirmButtonText = "Aceptar",
  timer = 2000,
} = {}) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "text-green-600 font-bold",
      confirmButton:
        "bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg",
    },

    buttonsStyling: false,
  });
}

export const showDeleteAlert = showDisableAlert;
export const showCancelDeleteAlert = showCancelDisableAlert;
export const showConfirmDeleteAlert = showConfirmDisableAlert;
export function showCancelAlert({
  title = "Cancelado",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 1000,
} = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "!text-red-600",
      confirmButton: "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg",
      timerProgressBar: "!bg-red-600 hover:bg-red-700 rounded-lg",
    },

    buttonsStyling: false,
  });
}
