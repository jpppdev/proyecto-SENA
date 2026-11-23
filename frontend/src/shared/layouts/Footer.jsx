import { ChefHat, ShieldCheck } from "lucide-react";

const information = [
  { label: "Ayuda", text: "Accede a los módulos desde el menú lateral. En Usuarios puedes consultar, buscar y administrar los registros del sistema." },
  { label: "Privacidad", text: "La política de privacidad todavía no está disponible en el sistema." },
  { label: "Términos de uso", text: "Los términos de uso todavía no están disponibles en el sistema." },
];

export default function Footer() {
  return (
    <footer className="mx-4 mt-8 border-t border-[#f4d9c5] text-[#681d0b] sm:mx-7">
      <div className="flex flex-col items-center justify-between gap-6 px-2 py-7 text-sm xl:flex-row xl:gap-5">
        <div className="flex items-center gap-3">
          <ChefHat className="size-9 shrink-0" strokeWidth={1.7} aria-hidden="true" />
          <div>
            <p className="text-base font-semibold">© {new Date().getFullYear()} Aurum Restaurante</p>
            <p className="mt-0.5 text-[#85817e]">Sistema de gestión administrativa</p>
          </div>
        </div>
        <nav aria-label="Información del sitio" className="flex flex-wrap justify-center gap-y-4 divide-x divide-[#efcdb7] xl:border-x xl:border-[#efcdb7] xl:px-8">
          {information.map(({ label, text }) => (
            <details key={label} className="relative px-4 sm:px-6">
              <summary className="cursor-pointer list-none rounded-sm hover:text-[#f56508] focus-visible:outline-2 focus-visible:outline-[#f56508] [&::-webkit-details-marker]:hidden">{label}</summary>
              <p className="absolute bottom-full left-1/2 z-50 mb-4 w-56 -translate-x-1/2 rounded-xl border border-[#f4d9c5] bg-[#fffaf5] p-4 leading-relaxed shadow-lg">{text}</p>
            </details>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-9 shrink-0 text-[#ff6508]" strokeWidth={1.6} aria-hidden="true" />
          <div>
            <p className="text-base font-semibold">Panel administrativo</p>
            <p className="mt-0.5 text-[#85817e]">Versión 1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
