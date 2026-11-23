// Componente Button 
export default function Button ({

    // props.. parámetros que recibe 
    variant = "primary",
    size = "md",
    type = "button",
    children ="",
    ...props
}){

    const variants = {
        primary : "rounded-md bg-brand text-text-success hover:bg-brand-hover font-medium-custom ",
        
        secondary : "rounded-md bg-brand text-text-primary hover:bg-brand-hover",

        tertiary : "rounded-md border border-border-clear2 bg-transparent text-text-coffee font-medium-custom hover:bg-brand-hover",
        
        create: "rounded bg-[var(--color-text-primary)] !text-[var(--semantic-text-secondary)] px-10 py-3.5 text-sm font-bold shadow-lg hover:opacity-80 active:scale-95 transition-all !border-none disabled:opacity-50 disabled:active:scale-100"
    };

    const sizes = {
        sm: `
            h-8 
            px-4
            before:absolute before:content-['']
            before:-inset-y-[9px] before:-inset-x-[0px]
            `,
        md: "h-10 px-4 before:absolute before:content-[''] before:-inset-y-[4px] before:-inset-x-[0px]",
        
    }
    return(
        <button
            type={type}
            className={`
                relative
                inline-flex items-center justify-center
                transition-colors
                ${variants[variant]}
                ${sizes[size]}
                `}
                {...props}
            >
            {children}
        </button>
    )
}
