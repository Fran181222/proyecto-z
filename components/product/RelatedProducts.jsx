import Link from "next/link";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mb-4">
        <p className="section-tag mb-1">También te puede gustar</p>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Productos similares
        </h3>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-6 col-md-3" key={product.id}>
            <Link href={`/productos/${product.id}`} style={{ textDecoration: "none" }}>
              <article
                className="jewel-card"
                style={{ cursor: "pointer" }}
              >
                <div className="jewel-media">
                  <img
                    src={product.images[0].src}
                    alt={product.name}
                  />
                </div>
                <div className="jewel-meta">
                  <span className="mini-label">{product.category}</span>
                  <h4 className="mt-2" style={{ fontSize: "0.95rem" }}>
                    {product.name}
                  </h4>
                  <strong style={{ color: "var(--wine)" }}>
                    ${product.price.toLocaleString("es-AR")}
                  </strong>
                </div>
              </article>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}