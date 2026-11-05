// CONFIGURACION PARA LOCAL Y PRODUCCION 

//Centraliza la URL de API segun el entorno


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";