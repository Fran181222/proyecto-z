import Link from "next/link";

export const metadata = {
  title: "Malibu Joyeria - Carrito",
  description: "Revisa los productos seleccionados en tu carrito.",
};

export default function CartPage() {
  return (
    <main className="page-shell">
      <section className="section-space">
        <div className="container">
          <p className="section-tag">
            <i className="fa-solid fa-bag-shopping me-2"></i>Carrito
          </p>
          <h1 className="section-title">Tu seleccion</h1>
          <p className="section-copy">
            El resumen interactivo del carrito esta disponible desde el boton de
            bolsa en la navegacion.
          </p>
          <Link className="btn-mali btn-gold" href="/productos">
            Seguir comprando
            <i className="fa-solid fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}
