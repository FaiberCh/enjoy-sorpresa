import { Heart, Star, Gift } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 pt-16"
    >
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm px-4 py-2 rounded-full mb-6">
            <Star size={14} className="fill-pink-500 text-pink-500" />
            Regalamos momentos inolvidables
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
            En Joy{" "}
            <span className="text-pink-500">Sorpresa</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Desayunos sorpresa, detalles personalizados y decoraciones únicas
            para hacer de cada ocasión especial un momento inolvidable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#pedido"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium transition-colors text-center"
            >
              Hacer un Pedido
            </a>
            <a
              href="#catalogo"
              className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full font-medium transition-colors text-center"
            >
              Ver Catálogo
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">253+</p>
              <p className="text-sm text-gray-500">Publicaciones</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">466+</p>
              <p className="text-sm text-gray-500">Seguidores</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">100%</p>
              <p className="text-sm text-gray-500">Personalizado</p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-pink-200 rounded-full opacity-30 animate-pulse" />
            <div className="absolute inset-4 bg-pink-100 rounded-full flex items-center justify-center">
              <Gift size={120} className="text-pink-400" />
            </div>
            <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl p-3 flex items-center gap-2">
              <Heart size={18} className="text-pink-500 fill-pink-500" />
              <span className="text-sm font-medium text-gray-700">Momentos únicos</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-pink-500 text-white rounded-2xl p-3">
              <p className="text-xs font-medium">Envíos a toda</p>
              <p className="text-sm font-bold">Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
