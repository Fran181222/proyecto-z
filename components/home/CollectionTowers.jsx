import Link from "next/link";
import { collections } from "@/data/products";

export default function CollectionTowers() {
  return (
    <section className="section-space pt-0">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-5">
          <div>
            <p className="section-tag">
              <i className="bi bi-collection me-2"></i>Colecciones
            </p>
            <h2 className="section-title">Explorá nuestras líneas</h2>
          </div>
          <p className="section-copy mb-0">
            Tres mundos distintos, una misma calidad Malibu.
          </p>
        </div>

        <div className="row g-4">
          {collections.map((col, index) => (
            <div className="col-12 col-md-4" key={col.id}>
              <Link href={col.href} style={{ textDecoration: "none" }}>
                <article
                  className="collection-tower-card"
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    aspectRatio: "3/4",
                    cursor: "pointer",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {/* Imagen de fondo */}
                  <img
                    src={col.image}
                    alt={col.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {/* Overlay degradado */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(16,43,31,0.85) 0%, transparent 55%)",
                    }}
                  />

                  {/* Número de torre */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      left: "1.25rem",
                      background: "var(--gold)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    0{index + 1}
                  </div>

                  {/* Contenido inferior */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "1.5rem",
                      color: "white",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "1.75rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {col.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        opacity: 0.8,
                        marginBottom: "1rem",
                      }}
                    >
                      {col.subtitle}
                    </p>
                    <span
                      className="btn-mali btn-gold"
                      style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
                    >
                      Ver colección
                      <i className="bi bi-arrow-right ms-2"></i>
                    </span>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
