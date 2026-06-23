import ProductCatalog from "@/components/catalog/ProductCatalog";
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
          <ProductCatalog products={products} />
        </div>
      </section>
    </main>
  );
}
