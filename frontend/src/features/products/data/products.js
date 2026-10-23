// src/data/products.js
import lasaña from "@/assets/images/lasaña.png";
import pasta from "@/assets/images/pasta.jpeg";
import pulpo from "@/assets/images/pulpo.jpg";
import bandeja from "@/assets/images/bandeja paisa.jpg";

export const products = [
  {
    id: 1,
    title: "Lasaña",
    price: 38000,
    description: "Deliciosa lasaña casera con capas de pasta, carne boloñesa, salsa bechamel y queso gratinado.",
    image: lasaña,
    category: "plato fuerte",
  },
  {
    id: 2,
    title: "Pasta",
    price: 32000,
    description: "Pasta artesanal al dente bañada en una exquisita salsa cremosa de la casa.",
    image: pasta,
    category: "plato fuerte",
  },
  {
    id: 3,
    title: "Pulpo",
    price: 55000,
    description: "Pulpo tierno a la parrilla acompañado de papas criollas y aderezo especial.",
    image: pulpo,
    category: "plato fuerte",
  },
  {
    id: 4,
    title: "Bandeja paisa",
    price: 45000,
    description: "Tradicional plato típico con frijoles, arroz, carne molida, chicharrón, huevo, chorizo, plátano, arepa y aguacate.",
    image: bandeja,
    category: "plato fuerte",
  },
];