import HeroGrid from "@/components/home/HeroGrid";
import JewelCards from "@/components/home/JewelCards";
import CollectionTowers from "@/components/home/CollectionTowers";
import TrendingSection from "@/components/home/TrendingSection";
import SetsCarousel from "@/components/home/SetsCarousel";

export const metadata = {
  title: "Malibu Joyería — Inicio",
  description: "Piezas pensadas para brillar con personalidad. Joyería artesanal con inspiración costera.",
};

export default function Home() {
  return (
    <main className="page-shell">
      {/* Hero principal */}
      <HeroGrid />

      {/* Piezas destacadas */}
      <JewelCards />
      
      {/* Carrusel de sets */}
      <SetsCarousel />

      {/* 3 Torres de colecciones — Punto 6 */}
      <CollectionTowers />

      {/* Tendencias con imágenes — Punto 9 */}
      <TrendingSection />

    </main>
  );
}