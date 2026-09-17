import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { products, sets } from "@/data/products";

export const metadata = {
  title: "Malibu Joyeria - Sets",
  description: "Colecciones y sets de Malibu Joyeria.",
};

function getSetImages(set) {
  const productImages = set.productIds
    .map((productId) => products.find((product) => product.id === productId)?.images?.[0]?.src)
    .filter(Boolean);

  return [set.image, ...productImages].slice(0, 4);
}

export default function SetsPage() {
  return (
    <main className="page-shell">
      <section className="sets-page-showcase section-space">
        <div className="container">
          <div className="sets-page-heading">
            <div>
              <p className="section-tag">
                <Layers size={17} />Sets
              </p>
              <h1 className="section-title">Looks para combinar</h1>
            </div>
            <p className="section-copy">
              Sets armados para ver el look completo, comparar piezas y entrar directo al detalle.
            </p>
          </div>

          <div className="sets-collection-grid mt-4">
            {sets.map((set) => {
              const images = getSetImages(set);

              return (
                <Link
                  className={`sets-collection-card sets-preview-card sets-preview-${set.accent} text-decoration-none`}
                  href={`/sets/${set.id}`}
                  key={set.id}
                >
                  <div className="sets-preview-media">
                    {images.map((image, index) => (
                      <img
                        key={`${set.id}-${image}`}
                        src={image}
                        alt={`${set.title} vista ${index + 1}`}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        style={{ "--preview-index": index }}
                      />
                    ))}
                    <span className="sets-preview-action">
                      Ver set <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="sets-collection-body">
                    <span className="mini-label">{set.productIds.length} articulos</span>
                    <h2 className="h4">{set.title}</h2>
                    <p>{set.subtitle}</p>
                    <div className="sets-preview-strip" aria-hidden="true">
                      {images.map((image, index) => (
                        <span
                          key={`${set.id}-thumb-${image}`}
                          style={{
                            backgroundImage: `url(${image})`,
                            "--preview-index": index,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
