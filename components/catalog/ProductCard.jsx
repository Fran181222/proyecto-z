"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="jewel-card">
      <div className="jewel-media">
        <img src={product.images[0].src} alt={product.name} />
        <button
          className="card-cart-btn"
          onClick={() => addItem(product)}
          aria-label={`Agregar ${product.name} al carrito`}
          type="button"
        >
          <i className="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
      <div className="jewel-meta">
        <span className="mini-label">{product.category}</span>
        <h4>{product.name}</h4>
        <p>{product.desc}</p>
        <div className="price-row">
          <strong>${product.price.toLocaleString("es-AR")}</strong>
          <Link href={`/productos/${product.id}`} className="btn-mali btn-outline-mali">
            Ver mas
          </Link>
        </div>
      </div>
    </article>
  );
}
