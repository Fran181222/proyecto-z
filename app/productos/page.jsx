import ProductCard from "@/components/catalog/ProductCard";
import { products } from "@/data/products";

export const metadata = {
  title: "Malibu Joyeria - Productos",
  description: "Catalogo de piezas Malibu Joyeria.",
};

export default function ProductsPage() {
  return (
    <main className="page-shell">
      <section className="section-space">
        <div className="container">
          <p className="section-tag">
            <i className="fa-regular fa-gem me-2"></i>Catalogo
          </p>
          <h1 className="section-title">Productos</h1>
          <div className="row g-4 mt-2">
            {products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
