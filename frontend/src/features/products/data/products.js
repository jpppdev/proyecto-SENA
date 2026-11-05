// src/data/products.js
import lasaña from "@/assets/images/lasaña.png";
import pasta from "@/assets/images/pasta.jpeg";
import pulpo from "@/assets/images/pulpo.jpg";
import bandeja from "@/assets/images/bandeja paisa.jpg";

export const products = [
  {
    id: 1,
    title: "lasaña",
    price: 3500000,
    description: "Laptop de alto rendimiento para desarrollo y diseño.",
    image: lasaña,
    category: "plato fuerte",
  },
  {
    id: 2,
    title: "pasta",
    price: 1200000,
    description: "Monitor IPS ideal para programación y edición.",
    image: pasta,
    category: "plato fuerte",
  },
  {
    id: 3,
    title: "pulpo",
    price: 80000,
    description: "Mouse ergonómico, la mejor calidad y precio.",
    image: pulpo,
    category: "plato fuerte",
  },
  {
    id: 4,
    title: "bandeja paisa",
    price: 50000,
    description: "Teclado mecánico con iluminación RGB.",
    image: bandeja,
    category: "plato fuerte",
  },
];