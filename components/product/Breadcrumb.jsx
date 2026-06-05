import Link from "next/link";

export default function Breadcrumb({ plan, collection, productName }) {
  return (
    <nav className="product-breadcrumb mb-4" aria-label="Ruta del producto">
      <Link href="/" style={{ opacity: 0.6, textDecoration: "none", fontSize: "0.82rem" }}>
        Inicio
      </Link>
      <span className="mx-2" style={{ opacity: 0.4 }}>›</span>
      {plan && (
        <>
          <span style={{ opacity: 0.6, fontSize: "0.82rem" }}>{plan}</span>
          <span className="mx-2" style={{ opacity: 0.4 }}>›</span>
        </>
      )}
      {collection && (
        <>
          <Link
            href={`/productos?coleccion=${collection.toLowerCase()}`}
            style={{ opacity: 0.6, textDecoration: "none", fontSize: "0.82rem" }}
          >
            {collection}
          </Link>
          <span className="mx-2" style={{ opacity: 0.4 }}>›</span>
        </>
      )}
      <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{productName}</span>
    </nav>
  );
}