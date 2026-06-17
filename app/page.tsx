import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Catalogo from "@/components/landing/Catalogo"
import Galeria from "@/components/landing/Galeria"
import Formulario from "@/components/landing/Formulario"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Catalogo />
      <Galeria />
      <Formulario />
      <Footer />
    </main>
  )
}
