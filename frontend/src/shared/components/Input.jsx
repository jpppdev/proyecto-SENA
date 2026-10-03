export default function Input({
    label,
    error,
    htmlFor, //Es para accesibilidad, la persona que tiene una discapacidad va a escuchar el texto que esta ahi con tab
    type = "text",
    variant="primary",
    size = "sm",
    ...props
}){
    
    const variants = {
            //Estos valores deben ser con variables 
        primary: `
            border border-[var(--color-border-clear)]
            bg-[var(--color-background-input)]
            text-[color:var(--text-inverse)] 
            hover:bg-[var(--color-brand-hover)] 
        `, 
        secondary: `
            border-red-300
            bg-gray-300
        `, 
        tertiary: `
            border border-border-clear
            bg-background-input
            text-text-secondary
            hover:border-brand
            focus:border-brand
            focus:bg-white
            focus:outline-none
            `
    }
    const sizes = {
        
        sm: `
            h-8
            
        `, 
        md: `
            h-10
        `, 
        lg: `
            h-12
        `
    }


    return(
        <div className="w-80">


                {/*Label */}
            <label 
                // htmlFor con kebab-case
                // obliga al a que se acomode al lado y ocupe todo el ancho
                //caption: tamaño de la letra.
                // mb-1: margen inferior de 1
                // text-secondary: color de texto secundario

                htmlFor={htmlFor}
                className={`
                    block   
                    text-caption
                    mb-1
                    text-secondary
                    ${
                        size === "sm"
                            ? "-mb-2"
                        : size === "md"
                            ? "-mb-0"
                            : "-mb-1"
                    }
                    ${error ? "text-red-800" : "text-[color:var(--text-primary)]"}
                `}
            > 
                {label}
            </label>


                {/* Contenedor del input */}
                <div 

                    className="
                        relative
                        h-12
                        flex
                        items-center
                    "
                >
                {/* Area interactiva invisible (48px)*/}
                <div
                    className="
                        absolute
                        inset-0
                    "

                    onMouseDown={(e) => {
                        e.preventDefault();
                        //Mueve el foco al siguiente nodo hermano en el DOM
                        //nextSibling puede ser texto; si no es elemento valido,
                        e.currentTarget.nextSibling.focus();
                    }}
                />


                {/* Input visual */}
                <input
                    id={htmlFor}
                    type={type}
                    className={`
                        relative
                        w-full
                        rounded-md
                        border
                        px-4
                        text-body
                        

                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                        focus:ring-brand
                        ${variants[variant]}
                        ${sizes[size]}

                        ${error ? "border-red-800" : ""}
                    `}
                        {...props}
                    />


            </div>

            
            {/*Feedback*/}
            {error && (
                <p className="text-caption text-red-800 place-self-start">{error}</p>
            )}
        </div>
    );
}