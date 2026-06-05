import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchaseActions from "@/components/product/ProductPurchaseActions";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewSection from "@/components/product/ReviewSection";
import { getProductById, getRelatedProducts, products } from "@/data/products";

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  return {
    title: product
      ? `Malibu Joyeria - ${product.name}`
      : "Malibu Joyeria - Producto",
    description: product?.desc || "Detalle de producto Malibu Joyeria.",
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);
  const displayPrice = product.pricesBySize
    ? Object.values(product.pricesBySize)[1] || product.price
    : product.price;
  const composition = product.tags?.includes("dorado")
    ? "Aleacion de metales con terminacion dorada pulida."
    : "Materiales seleccionados y terminaciones de bijouterie premium.";

  return (
    <main className="product-detail-page">
      <section className="product-detail-hero">
        <div className="container">
          <div className="product-detail-grid">
            <div className="product-detail-media">
              <ProductGallery images={product.images} />
            </div>

            <div className="product-detail-info">
              <nav className="detail-breadcrumb" aria-label="Ruta del producto">
                <span>Inicio</span>
                <span>{product.collection}</span>
                <span>{product.category}</span>
                <strong>{product.name}</strong>
              </nav>

              <span className="mini-label">{product.category}</span>
              <h1>{product.name}</h1>
              <strong className="detail-price">
                ${displayPrice.toLocaleString("es-AR")}
              </strong>
              <p className="detail-tax-note">Precio sin impuestos</p>
              <p className="section-copy">{product.desc}</p>

              <ProductPurchaseActions product={product} />

              <div className="detail-copy-stack">
                <section>
                  <h2>Descripcion</h2>
                  <p>{product.desc}</p>
                </section>

                <section>
                  <h2>Composicion</h2>
                  <p>{composition}</p>
                </section>

                <section>
                  <h2>Cuidados del producto</h2>
                  <ul>
                    <li>
                      <i className="bi bi-droplet"></i>
                      Evitar el contacto frecuente con liquidos.
                    </li>
                    <li>
                      <i className="bi bi-stars"></i>
                      Aplicar perfumes y cremas antes de usar la pieza.
                    </li>
                    <li>
                      <i className="bi bi-box-seam"></i>
                      Guardar en un lugar seco, cerrado y separado.
                    </li>
                  </ul>
                </section>

                <p className="detail-photo-note">
                  Las fotos son ilustrativas. Los tonos, medidas y brillos
                  pueden variar levemente por luz, pantalla y produccion
                  artesanal.
                </p>

                <div className="detail-socials" aria-label="Compartir">
                  <a href="#" aria-label="Compartir en Facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" aria-label="Compartir en X">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                  <a href="#" aria-label="Compartir en Pinterest">
                    <i className="fa-brands fa-pinterest-p"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-detail-support">
        <div className="container">
          <ReviewSection initialReviews={product.reviews} />
          <RelatedProducts products={relatedProducts} />
        </div>
      </section>
    </main>
  );
}
