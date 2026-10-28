"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function JewelCards({ products }) {
  const { addItem } = useCart();

  return (
    <section className="pb-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <p className="section-tag">Selecciones destacadas</p>
            <h2 className="section-title">Las piezas mas elegidas</h2>
          </div>
          <p className="section-copy mb-0">
            Cada pieza responde con profundidad, zoom suave y una jerarquia visual limpia.
          </p>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-md-6 col-xl-3" key={product.id}>
              <article className="jewel-card">
                <div className="jewel-media">
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <button
                    onClick={() => addItem(product)}
                    aria-label={`Agregar ${product.name} al carrito`}
                    className="card-cart-btn"
                    type="button"
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                  </button>
                </div>
                <div className="jewel-meta">
                  <span className="mini-label">{product.category}</span>
                  <h4 className="mt-3">{product.name}</h4>
                  <p className="text-secondary">{product.desc}</p>
                  <div className="price-row">
                    <strong>${product.price.toLocaleString("es-AR")}</strong>
                    <Link
                      href={`/productos/${product.id}`}
                      className="btn-mali btn-outline-mali"
                    >
                      Ver mas
                    </Link>
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
