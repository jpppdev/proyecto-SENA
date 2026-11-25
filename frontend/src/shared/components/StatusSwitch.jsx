import { useState } from "react";

// Iconos usados dentro de switch
import { Check, X } from "lucide-react";

// componente reutilizable para representar un switch de estado (activo/inactivo)
export default function StatusSwitch({
    checked,         // Estado controlado, cuando se proporciona
    onChange,        // callback que se ejecuta cuando cambia de estado
    disabled = false, // permite deshabilitar la interacción
    size = "md"      // tamaño del switch (sm, md, lg)
}) {

    const [uncontrolledActive, setUncontrolledActive] = useState(false);
    const isActive = checked ?? uncontrolledActive;

    const handleToggle = () => {
        const nextValue = !isActive;
        if (checked === undefined) setUncontrolledActive(nextValue);
        onChange?.(nextValue);
    };

    // Clases del tamaño del contenedor del switch
    const sizes = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
    };

    // clases del tamaño del "knob" (el circulo que se mueve)
    const knobSizes = { 
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (
        // Botón que funciona como switch
        <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={handleToggle}
            disabled={disabled}
            className={`
                relative inline-flex items-center
                rounded-full transition-colors
                ${sizes[size]}
                ${isActive ? "bg-green-500" : "bg-gray-300"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            {/* "Knob" del switch (el círculo que se mueve de izquierda a derecha) */}
            <span
                className={`
                    absolute left-0.5 flex items-center justify-center
                    rounded-full bg-white shadow
                    transition-transform
                    ${knobSizes[size]}
                    ${isActive ? "translate-x-full" : "translate-x-0"}
                `}
            >
                {/* Icono que cambia dependiendo del estado */}
                {isActive ? (
                    <Check size={12} className="text-green-600" />
                ) : (
                    <X size={12} className="text-gray-500" />
                )}
            </span>
        </button>
    );
}