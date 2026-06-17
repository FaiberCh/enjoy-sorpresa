import { Heart, ExternalLink, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="text-pink-400 fill-pink-400" size={20} />
              <span className="text-lg font-bold">En Joy Sorpresa</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Regalamos momentos inolvidables. Desayunos sorpresa, detalles
              personalizados y decoraciones únicas para tus ocasiones especiales.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-pink-400">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Desayunos Sorpresa</li>
              <li>Detalles Personalizados</li>
              <li>Decoración con Globos</li>
              <li>Regalos Especiales</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-pink-400">Contáctanos</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/573506182545"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
              >
                <MessageCircle size={16} />
                +57 350 618 2545
              </a>
              <a
                href="https://www.instagram.com/enjoysorpresa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
              >
                <ExternalLink size={16} />
                @enjoysorpresa
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2024 En Joy Sorpresa. Todos los derechos reservados.</p>
          <p>By @juliethbarragan · Colombia</p>
        </div>
      </div>
    </footer>
  )
}
