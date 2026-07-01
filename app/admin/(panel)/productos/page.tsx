import ProductosGrid from "@/components/admin/ProductosGrid"

export default function ProductosPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona el catálogo de productos y sus imágenes</p>
      </div>
      <ProductosGrid />
    </div>
  )
}
