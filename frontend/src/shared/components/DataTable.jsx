// Hooks y utilidades principales de TanStack Table
import {
  useReactTable,          // Hook que crea la instancia de la tabla
  getCoreRowModel,        // Modelo base de filas (sin filtros ni paginación)
  flexRender,             // Permite renderizar contenido dinámico de columnas
  getPaginationRowModel,  // Modelo de filas con paginación
  getFilteredRowModel     // Modelo de filas filtradas
} from "@tanstack/react-table"


// Hook de React para manejar estado
import { useState } from "react"
import { ChevronDown } from "lucide-react"


// Botón reutilizable del sistema de componentes
import { Button, Input } from "@/shared";


// Componente reutilizable de tabla
// Recibe:
// - data: datos que se mostrarán
// - columns: configuración de columnas
export default function DataTable({ data, columns }) {


  // ================== ESTADO DE PAGINACIÓN ==================
  // pageIndex → página actual
  // pageSize → cantidad de filas por página
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })


  // ================== ESTADO DEL FILTRO GLOBAL ==================
  // Se usa para el buscador de la tabla
  const [globalFilter, setGlobalFilter] = useState("")


  // ================== CONFIGURACIÓN DE LA TABLA ==================
  // TanStack Table v8 no es compatible con la memorización de React Compiler.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({


    // Datos que se mostrarán
    data,


    // Definición de columnas
    columns,


    // Estado controlado de la tabla
    state: {
      globalFilter,
      pagination
    },


    // Función que se ejecuta cuando cambia la paginación
    onPaginationChange: setPagination,


    // Función que se ejecuta cuando cambia el filtro global
    onGlobalFilterChange: setGlobalFilter,


    // Modelo base de filas
    getCoreRowModel: getCoreRowModel(),


    // Modelo con filtrado aplicado
    getFilteredRowModel: getFilteredRowModel(),


    // Modelo con paginación aplicada
    getPaginationRowModel: getPaginationRowModel(),
  })


return (
  // cuadro total de toda la tabla,
  <div className=" ">
    {/* ================== TOOLBAR ================== */}
    {/* Barra superior con buscador y selector de filas */}
    <div className="contenedor-1 flex items-center justify-between gap-4 mb-5 rounded-[18px] bg-background-positive/88 p-3.75 shadow-sm">
      {/* ================== BUSCADOR ================== */}
      {/* Filtra todas las columnas de la tabla */}
      <Input
        type="text"
        variant="primary" // Usa la variante que tienes configurada en Input.jsx
        size="md"         // Puedes usar "sm", "md" o "lg" según configuraste
        placeholder="Buscar usuarios..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)} 
        />

      {/* ================== SELECTOR DE FILAS ================== */}
      {/* Permite cambiar cuántas filas se muestran por página */}
      <div className="relative shrink-0">
        <select
          aria-label="Filas por página"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-12 appearance-none pl-6 pr-10 rounded-2xl font-medium transition-all duration-200 border text-text-coffee border-border-clear2"
        >
          {[5, 7, 10, 20, 50].map(size => (
            <option key={size} value={size}>
              {size} filas
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-coffee"
        />
      </div>

    </div>

    {/* ================== TABLA ================== */}
    <div className="contenedor-2
      min-w-0
      overflow-hidden 
      rounded-[19px]
      border border-t-0 border-border-clear2
      bg-background-positive/92
      pb-1
      shadow-sm
      w-full
      overflow-x-auto">
      
      {/* ================== description ================== 

      Restablece el ancho mínimo a cero.  evita que los elementos hijos se desborden cuando contienen texto largo
      Oculta cualquier contenido que sobrepase los límites del contenedor.
      redondeo 
      borde de 1 píxel color del borde
      padding-bottom Relleno inferior
      Sombra personalizada difuminada hacia abajo con un tono marrón/tierra muy sutil y baja opacidad (5.5%).
      Hace que el contenedor tome el 100% del ancho de su elemento padre.
      Permite el desplazamiento horizontal únicamente cuando el contenido interno es más ancho que el contenedor.
      
      */}
      
      <table className="contenedor-3 w-full border-collapse ">

        {/* ================== CABECERA ================== */}
        <thead className=" bg-background-clear text-text-coffee">

          {/* TanStack agrupa cabeceras automáticamente */}
          {table.getHeaderGroups().map(headerGroup => (

            <tr key={headerGroup.id} >
              {headerGroup.headers.map(header => (


                  <th
                    key={header.id}
                    className="p-3 text-left border-b border-border-clear2"
                  >


                    {/* 
                      flexRender permite renderizar:
                      - texto
                      - JSX
                      - funciones
                      definidos en columnDef.header
                    */}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}


                  </th>


                ))}
              </tr>


            ))}
          </thead>


        {/* ================== CUERPO DE LA TABLA ================== */}
        <tbody>


            {/* Filas generadas por TanStack */}
            {table.getRowModel().rows.map(row => (


              <tr key={row.id} className="bg-background-positive hover:bg-background-clear/30 [&:last-child>td]:border-b-0">


                {/* Celdas visibles de cada fila */}
                {row.getVisibleCells().map(cell => (


                  <td key={cell.id} className="p-3 border-b border-border-clear2 text-text-coffee">


                    {/* Render dinámico del contenido de la celda */}
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}


                  </td>


                ))}


              </tr>


            ))}


          </tbody>


        </table>
      </div>


      {/* ================== FOOTER ================== */}
      <div className="flex items-center justify-between">


        {/* ================== INFORMACIÓN ================== */}
        {/* Cantidad de registros visibles */}
        <span className="text-medium text-text-secondary">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>


        {/* ================== CONTROLES DE PAGINACIÓN ================== */}
        <div className="flex items-center gap-2 p-4 [&>button:disabled]:opacity-50">


          {/* Ir a la primera página */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Inicio
          </Button>


          {/* Página anterior */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>


          {/* Información de página actual */}
          <span className="text-sm px-2">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>


          {/* Página siguiente */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>


          {/* Ir a la última página */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Final
          </Button>


        </div>


      </div>


      {/* ================== IR A PÁGINA ================== */}
      {/* Permite navegar directamente a una página específica */}
      <div className="flex items-center gap-2 text-sm">


        <span>Ir a página:</span>


        <input
          type="number"


          // Página actual (se muestra +1 porque el índice empieza en 0)
          defaultValue={table.getState().pagination.pageIndex + 1}


          onChange={(e) => {


            // Convierte el número ingresado en índice de página
            const page = e.target.value ? Number(e.target.value) - 1 : 0


            // Cambia la página
            table.setPageIndex(page)
          }}


          className="border rounded px-2 py-1 w-16"
        />


      </div>


  </div>
    
  )
}
