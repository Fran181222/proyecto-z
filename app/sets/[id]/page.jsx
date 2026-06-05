import Link from "next/link";
import { notFound } from "next/navigation";
import SetProductAddButton from "@/components/sets/SetProductAddButton";
import { getSetById, sets } from "@/data/products";

export async function generateStaticParams() {
  return sets.map((set) => ({ id: set.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const set = getSetById(id);

  return {
    title: set ? `Malibu Joyeria - ${set.title}` : "Malibu Joyeria - Set",
    description: set?.subtitle || "Set curado de Malibu Joyeria.",
  };
}

export default async function SetDetailPage({ params }) {
  const { id } = await params;
  const set = getSetById(id);

  if (!set) {
    notFound();
  }

  return (
    <main className="set-detail-page">
      <section className="set-detail-shell">
        <div className="set-detail-visual">
          <nav className="set-detail-breadcrumb" aria-label="Ruta del set">
            <Link href="/">Inicio</Link>
            <span>Sets</span>
            <strong>{set.title}</strong>
          </nav>
          <img src={set.image} alt={set.title} />
          <div className="set-detail-title">
            <span>{set.products.length} articulos</span>
            <h1>{set.title}</h1>
            <p>{set.subtitle}</p>
          </div>
        </div>

        <aside className="set-detail-products" aria-label="Productos del set">
          <p className="set-detail-kicker">Encontra tu estilo</p>
          <h2>{set.products.length} articulos</h2>
          <div className="set-product-list">
            {set.products.map((product) => (
              <article className="set-product-row" key={product.id}>
                <Link href={`/productos/${product.id}`} className="set-product-image">
                  <img src={product.images[0].src} alt={product.name} />
                </Link>
                <div className="set-product-copy">
                  <strong>${product.price.toLocaleString("es-AR")}</strong>
                  <Link href={`/productos/${product.id}`}>{product.name}</Link>
                  <span>{product.category}</span>
                </div>
                <SetProductAddButton product={product} />
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
