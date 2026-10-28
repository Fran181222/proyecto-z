import HeroGrid from "@/components/home/HeroGrid";
import JewelCards from "@/components/home/JewelCards";
import CollectionTowers from "@/components/home/CollectionTowers";
import TrendingSection from "@/components/home/TrendingSection";
import SetsCarousel from "@/components/home/SetsCarousel";
import { getProducts, getSets } from "@/data/catalog";

export const revalidate = 60;

export const metadata = {
  title: "Malibu Joyería — Inicio",
  description: "Piezas pensadas para brillar con personalidad. Joyería artesanal con inspiración costera.",
};

export default async function Home() {
  const [products, sets] = await Promise.all([getProducts(), getSets()]);

  return (
    <main className="page-shell">
      {/* Hero principal */}
      <HeroGrid />

      {/* Piezas destacadas */}
      <JewelCards products={products.slice(0, 4)} />
      
      {/* Carrusel de sets */}
      <SetsCarousel sets={sets} />

      {/* 3 Torres de colecciones — Punto 6 */}
      <CollectionTowers />

      {/* Tendencias con imágenes — Punto 9 */}
      <TrendingSection />

    </main>
  );
}