// src/shared/components/IconButton.jsx
import React from "react";
import clsx from "clsx";

/**
 * IconButton
 * - Area táctil (hit area): tamaño del botón
 * - Area visible: tamaño del ícono (controlado por wrapper interno)
 */

// React.forwardRef "puente para que el padre controle el DOM interno".

export const IconButton = React.forwardRef(function IconButton(
  {
    children,
    onClick,
    disabled = false,
    className = "",
    variant = "default",

    // Tamaños
    hitSize = 48,   // px (área táctil)
    iconSize = 24,  // px (icono visible)

    // Accesibilidad
    ariaLabel,

    // Estados
    isActive = false,

    ...props
  },
    ref
) {
    const baseStyles = `
        inline-flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
    `;

    const variants = {
        default: `
            rounded-full
            text-text-secondary
            hover:bg-brand-light
            focus-visible:ring-border-strong
        `,
        ghost: `
            rounded-full
            text-text-secondary
            hover:bg-brand-light
            focus-visible:ring-surface
        `,
        primary: `
            rounded-full
            text-text-inverse bg-blue-600
            hover:bg-blue-700
            focus-visible:ring-blue-500
        `,
        action: `
            rounded-[14px] text-brand bg-border-clear2
            hover:bg-brand-soft/40 focus-visible:ring-focus-ring
        `,
        danger: `
            rounded-[14px] text-[#ff3038] bg-[#ffeded]
            hover:bg-[#ffdddd] focus-visible:ring-red-400
        `,
    };

    return (
        <button
            ref={ref}
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onClick}
            className={clsx(baseStyles, variants[variant], className, {"bg-surface-muted": isActive,
        })}
        style={{
            width: `${hitSize}px`,
            height: `${hitSize}px`,
        }}
        {...props}
        >

            <span
                style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                }}
                className="flex items-center justify-center"
            >
                {children}
            </span>
        </button>
    );
});
// export default IconButton;  
