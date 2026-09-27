// src/shared/services/alertService.js
import Swal from "sweetalert2";

export function showSuccessAlert({
  title = "Éxito",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 1000,
}) {
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
}) {
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
export function showDeleteAlert({
  title = "¿Estás seguro?",
  text = "Esta acción no se puede deshacer",
  confirmButtonText = "Sí, eliminar",
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

export function showCancelDeleteAlert({
  title = "Eliminación cancelada",
  text = "La eliminación del usuario fue cancelada.",
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