import { useState, useEffect } from "react";
import Card from "@/shared/components/Card";
import { products } from "@/features/products";
import { getProducts } from "../services/productServices";

export default function DishesPage() {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProductsData(data))
      .catch((error) => console.error("Error cargando productos:", error));
  }, []);
  
  return (
    <div className="mx-auto mt-4 max-w-7x1">
      {/* Hero */}
      {/* Carrusel */ }
      {/* Titulo */}
      <h2 className="text-h2 place-self-center mb-12">
          Productos
      </h2>
        {/* Cards */}
      <div 
        className="
        grid
        gap-4
        mx-6
        sm:grid-cols-2
        sm:mx-12
        lg:grid-cols-3
        xl:grid-cols-4
        justify-items-center
        ">

        {(productsData.length > 0 ? productsData : products).map((product) => (
          <Card key={product.id} product={product} />
        ))}

        </div>
    </div>
  )
}