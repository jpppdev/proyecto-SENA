import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

import { createUser } from "../services/userServices";

const [ isSubmitting, setIsSubmitting] = useState(false);

//================================ HANDLE SUBMIT ========================
const handleSubmit = async (e) => {
    // Evita que el formulario recargue la página
    e.preventDefault();

    // Validamos los datos del formulario contra el esquema Zod
    // safeParse NO lanza excepción, retorna un objeto controlado 
    const result = userSchema.safeParse(formData);

    // Verificar en consola si el esquema está funcionando correctamente
    console.log(result);

    // Si la validación falla
    if (!result.sucess) {
        // Objeto donde almacenaremos los errores por campo
        const fieldErrors = {};

        // Recorremos cada error generado por Zod
        result.error.issues.forEach((issue) => {
            // issue.path[0] corresponde al nombre del campo
            // issue.message contiene el mensaje de error definido en el schema 

            fieldErrors[issue.path[0]] = issue.message;
        });

        //  Actualizamos el estado de errores para mostrarlos en la UI
        setErrors(fieldErrors);

        // Cortamos la ejecución: NO se envía nada al backend

        return;
    }

    // Si la validación pasa, limpiamos errores previos
    setErrors({});

    // Activamos estado de envío (útil para deshabilitar el botón)
    setIsSubmitting(true);

    try {
        // Llamamos al servicio frontend que consume la API 
        // result.data contiene los datos ya validados por Zod
        const responde = await createUser(result.data);

        // Log informativo para desarrollo
        console.log("Usuario creado:", responde);

        // Feedback básico al usuario
        alert("Usuario creado correctamente");

        // Navegamos a la vista anterior
        // navigate(-1) equivale a "volver atrás"
        navigate(-1);
    } catch (error) {
        // Capturamos errores de red o errores lanzados por el service
        console.error("Error:", error.message);

        // Mostramos el mensaje de error al usuario
        alert(error.message);               
    } finally {
        // Pase lo que pase, desactivamos el estado de envío
        setIsSubmitting(false);
    }
};