import Swal from "sweetalert2"
export function showSuccessAlert({
    //los valores despues del = son valores por defecto
    title= "Exito",
    text= "",
    confirmButtonText = "Aceptar",
    timer = 1000,
}) {
    //Swal.fire() crea el modal
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonText,
        timer,
        timerProgressBar: true,
        ShowConfirmButton: true,

        customClass: {
            popup: "rounded-2x1",
            title: "texte-green-600",
            confirmButton: "bg-green-600 hover:bg-green700 px-4 py-2 rounded-lg",
        },
        
        buttonsStyling: false,
    })
}

export function showDeleteAlert({
    //los valores despues del = son valores por defecto
    title= "Eliminar",
    text= "",
    cancelButtonText = "Cancelar",
    confirmButtonText = "Si, eliminar",
 
}) {
    //Swal.fire() crea el modal
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonText,
        cancelButtonText,   
        showCancelButton: true,
        showConfirmButton: true,

        customClass: {
            popup: "rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/50",
            title: "text-[var(--color-text-primary)] font-extrabold text-xl",
            actions: "flex gap-3 w-full justify-center mt-4",
            confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md border-none transition-all mx-2",
            cancelButton: "bg-white/60 border-2 border-gray-400 hover:bg-white/80 text-gray-800 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all mx-2",
        },
        
        buttonsStyling: false,
    })
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
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg",
    },

    buttonsStyling: false,
  });
}