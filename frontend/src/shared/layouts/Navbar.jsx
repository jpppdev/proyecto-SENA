import { useState } from "react";
import { Menu } from "lucide-react";
import {
  IconButton,
  SearchField,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";
import  logo  from "@/assets/images/1-logo.png";
import { Link } from "react-router-dom";
import { showErrorAlert } from "@/shared/services/alertService";
// import { useNavigate } from "react-router-dom";

export default function Navbar(){


  // Componente de búsqueda 😂😂😂
  const [search, setSearch] = useState("");


  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };


  const handleClear = () => {
    console.log("Campo limpiado");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    showErrorAlert({
      title: "Error inesperado",
      text: "Ha ocurrido un error inesperado al acceder a Contacto.",
      timer: 2500,
    });
  };

  return (
    <nav className="w-full bg-white/30  backdrop-blur-md relative z-50">
      
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo de marca */}
          <div className=" hidden sm:block items-center">
            <Link to={"/dashboard"} className="text-h1 font-heading">
              <img src={logo} alt="logo" className="h-12" />
            </Link>
          </div>


            {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link to={"/Dashboard/home"} className="hover:text-primary transition">
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to={"/dashboard/Dishes"}
                className="hover:text-primary transition"
              >
                Platillos
              </Link>
            </li>

           

            <li>
              <Link
                
                onClick={handleContactClick}
                className="hover:text-primary transition cursor-pointer"
              >
                Contacto
              </Link>
            </li>

            </ul>

                {/* SearchField + IconButton */}
            <div>
              <SearchField
                value={search}
                onChange={setSearch}
                onSubmit={handleSearch}
                onClear={handleClear}
                placeholder="Buscar productos..."
                size="md"
                variant="outlined"
                className="w-76"
              />
            </div>

        {/* Dropdown */}
        <div>
      <Dropdown className="z-50">
          {/* Disparador */}
          <DropdownTrigger>
            <IconButton>
              <Menu/>
            </IconButton>
          </DropdownTrigger>

          {/* Contenido */}
        <DropdownContent>
          <DropdownItem>
            <Link to="/dashboard/userList" className="block w-full">
            Módulo usuario
            </Link>
          </DropdownItem>
          
          <DropdownItem>
            <Link to="/dashboard/inventoryList" className="block w-full">
              Módulo inventario
            </Link>
          </DropdownItem>

          <DropdownItem>
            <Link to="/dashboard/providerList" className="block w-full">
              Módulo proveedor
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/dashboard/menuList" className="block w-full">
              Módulo menu
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/dashboard/orderList" className="block w-full">
              Módulo orden
            </Link>
          </DropdownItem>

          <DropdownItem>
            <Link to="/login" className="block w-full">
              Cerrar sesión
            </Link>
          </DropdownItem>
          
        </DropdownContent>

      </Dropdown>
        </div>

        </div>
      </div>
    </nav>
  );
};