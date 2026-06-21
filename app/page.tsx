import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Catalogo from "@/components/landing/Catalogo"
import Galeria from "@/components/landing/Galeria"
import Formulario from "@/components/landing/Formulario"
import Footer from "@/components/landing/Footer"
import WhatsAppButton from "@/components/landing/WhatsAppButton"

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Catalogo />
      <div className="w-full overflow-hidden h-80 md:h-[420px]">
        <img src="/banner.webp" alt="En Joy Sorpresa" className="w-full h-full object-cover object-center" />
      </div>
      <Galeria />
      <Formulario />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
