import { Star } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="flex items-center pt-16 relative overflow-hidden"
    >
      {/* móvil: centrado con overlay fuerte para que el logo no tape el texto */}
      <div className="absolute inset-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }} />
      <div className="absolute inset-0 md:hidden bg-pink-950/75" />
      {/* escritorio: logo desplazado a la derecha con gradiente */}
      <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: "url('/banner.webp')", backgroundSize: "135% auto", backgroundPosition: "0% 42%" }} />
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-pink-950/80 via-pink-900/40 to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 py-14">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-2 rounded-full mb-6 border border-white/30">
            <Star size={14} className="fill-white text-white" />
            Regalamos momentos inolvidables
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            En Joy{" "}
            <span className="text-pink-200">Sorpresa</span>
          </h1>

          <p className="text-lg text-white/85 mb-8 leading-relaxed">
            Desayunos sorpresa, detalles personalizados y decoraciones únicas
            para hacer de cada ocasión especial un momento inolvidable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#pedido"
              className="bg-white hover:bg-pink-50 text-pink-600 px-8 py-3 rounded-full font-medium transition-colors text-center"
            >
              Hacer un Pedido
            </a>
            <a
              href="#catalogo"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-colors text-center"
            >
              Ver Catálogo
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">253+</p>
              <p className="text-sm text-white/70">Publicaciones</p>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">466+</p>
              <p className="text-sm text-white/70">Seguidores</p>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-sm text-white/70">Personalizado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
