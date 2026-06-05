"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const TRENDING = [
  {
    id: "bufandon-premium",
    name: "Bufandón Premium",
    category: "Bufandones",
    price: 38500,
    badge: "🔥 Tendencia",
    image: "/img/display-shiny-luxurious-golden-chain.jpg",
    href: "/productos?coleccion=accesorios",
  },
  {
    id: "collar-sunset-layers",
    name: "Collar Sunset Layers",
    category: "Collares",
    price: 84900,
    badge: "⭐ Más vendido",
    image: "/img/display-shiny-elegant-gold-chain.jpg",
    href: "/productos/collar-sunset-layers",
  },
  {
    id: "anillo-coral-glow",
    name: "Anillo Coral Glow",
    category: "Anillos",
    price: 61500,
    badge: "✨ Nuevo",
    image: "/img/expensive-golden-ring-displayed-white-coral-background.jpg",
    href: "/productos/anillo-coral-glow",
  },
  {
    id: "pulsera-coastline",
    name: "Pulsera Coastline",
    category: "Pulseras",
    price: 42700,
    badge: "💎 Premium",
    image: "/img/vista-arriba-cadenas-oro-naturaleza-muerta_23-2149560671.avif",
    href: "/productos/pulsera-coastline",
  },
];

export default function TrendingSection() {
  const { addItem } = useCart();

  return (
    <section className="section-space pt-0">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-5">
          <div>
            <p className="section-tag">
              <i className="bi bi-graph-up-arrow me-2"></i>En tendencia
            </p>
            <h2 className="section-title">Lo que se está usando ahora</h2>
          </div>
          <Link className="btn-mali btn-outline-mali" href="/productos">
            Ver todo el catálogo
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        <div className="row g-4">
          {TRENDING.map((item) => (
            <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
              <article
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.25s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Imagen */}
                <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      background: "var(--surface-strong)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.2rem 0.65rem",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--wine)",
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span className="mini-label mb-2">{item.category}</span>
                  <h4
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "1.2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.name}
                  </h4>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <strong style={{ fontSize: "1.1rem", color: "var(--wine)" }}>
                      ${item.price.toLocaleString("es-AR")}
                    </strong>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => addItem({ ...item, images: [{ src: item.image }], desc: item.category })}
                        className="btn-mali btn-gold"
                        style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                        aria-label="Agregar al carrito"
                      >
                        <i className="fa-solid fa-bag-shopping"></i>
                      </button>
                      <Link
                        href={item.href}
                        className="btn-mali btn-outline-mali"
                        style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
