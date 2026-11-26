import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  cloneElement
} from "react"

const DropdownContext = createContext(null) //EL PAPÁ

export function Dropdown({
  children,
  open: controlledOpen,
  onOpenChange,
  className = ""
}) {

    //NO CONTROLADO - El dropdown maneja su propio estado de abierto/cerra
    //MODO CONTROLADO - Tú decides desde afuera si está abierto o cerrado
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    // Si no se pone el onchange en el controlado se queda ahi. nunca cambia porq ue nadie escucha el evento 
  const setOpen = useCallback((value) => {
    if (isControlled) {
      onOpenChange?.(value)  // Le avisa al papa
    } else {
      setUncontrolledOpen(value) // Lo cambia el mismo
    }
  }, [isControlled, onOpenChange])

  

  const containerRef = useRef(null)

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside) //mousedown escucha todos los clicks
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setOpen])



  // Escape key, esto es accesibilidad todos los dropdowns se cierran con Esc
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [setOpen])


  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// Trigger (asChild pattern)
export function DropdownTrigger({ children }) {
  const { open, setOpen } = useContext(DropdownContext)

  if (!children) return null


  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e)
      setOpen(!open)
    },
    "aria-expanded": open, // Accesibilidad le dice este boton tiene un menú y ahora esta abierto/cerrado.
    "aria-haspopup": "menu"
  })
}

// Content
// Esto aparece cuando le das clic
export function DropdownContent({ children, className = "" }) {
  const { open } = useContext(DropdownContext)


  if (!open) return null //Si está cerrado, ni renderiza el menú

  return (
    <div
      role="menu"
      className={`
        absolute
        mt-1
        min-w-48
        border
        text-text-inverse
        p-1
        dark:bg-neutral-950/80
        backdrop-blur-[1px]
        shadow-lg
        rounded-2xl
        overflow-hidden
        hover:shadow-black
        transition-shadow duration-700
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Item
export function DropdownItem({
  children,
  onClick,
  className = "",
  asChild = false,
}) {
  const { setOpen } = useContext(DropdownContext);
  const itemClassName = `block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-text-muted focus:bg-brand-light ${className}`;

  const handleClick = (event) => {
    onClick?.(event);
    setOpen(false);
  };

  if (asChild) {
    return cloneElement(children, {
      role: "menuitem",
      className: `${itemClassName} ${children.props.className ?? ""}`,
      onClick: (event) => {
        children.props.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button type="button" role="menuitem" onClick={handleClick} className={itemClassName}>
      {children}
    </button>
  );
}
