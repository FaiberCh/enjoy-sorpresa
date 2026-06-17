import { Producto } from "@/types"

export const productosEjemplo: Producto[] = [
  {
    id: "1",
    nombre: "Desayuno Sorpresa Romántico",
    descripcion: "Bandeja con croissants, frutas, jugos naturales, flores y tarjeta personalizada. Ideal para aniversarios y San Valentín.",
    precio: 85000,
    categoria: "Desayunos",
    imagen_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80",
    disponible: true,
  },
  {
    id: "2",
    nombre: "Desayuno Cumpleaños",
    descripcion: "Bandeja festiva con pancakes, frutas, globos y decoración personalizada con el nombre del cumpleañero.",
    precio: 95000,
    categoria: "Desayunos",
    imagen_url: "https://images.unsplash.com/photo-1484723091739-30990099e517?w=500&q=80",
    disponible: true,
  },
  {
    id: "3",
    nombre: "Caja de Detalles Personalizados",
    descripcion: "Caja sorpresa con taza personalizada, chocolates, peluche y mensaje especial. Perfecta para cualquier ocasión.",
    precio: 120000,
    categoria: "Detalles",
    imagen_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
    disponible: true,
  },
  {
    id: "4",
    nombre: "Decoración Globos Temática",
    descripcion: "Arco o columna de globos personalizados con colores y tema a elección. Incluye instalación.",
    precio: 150000,
    categoria: "Decoración",
    imagen_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
    disponible: true,
  },
  {
    id: "5",
    nombre: "Taza Personalizada",
    descripcion: "Taza cerámica con foto y mensaje personalizado. Viene en caja de regalo con moño.",
    precio: 45000,
    categoria: "Detalles",
    imagen_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    disponible: true,
  },
  {
    id: "6",
    nombre: "Desayuno Baby Shower",
    descripcion: "Bandeja temática para celebrar la llegada del bebé, con decoración en azul o rosado y productos dulces.",
    precio: 110000,
    categoria: "Desayunos",
    imagen_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    disponible: true,
  },
]

export const categoriasEjemplo = ["Todos", "Desayunos", "Detalles", "Decoración"]

export const galeriaEjemplo = [
  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  "https://images.unsplash.com/photo-1484723091739-30990099e517?w=600&q=80",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80",
  "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",
]

export const formatPrecio = (precio: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(precio)
