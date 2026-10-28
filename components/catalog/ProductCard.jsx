"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="jewel-card">
      <div className="jewel-media">
        <Link href={`/productos/${product.id}`}>
        <Image
            src={product.images[0].src}
            alt={product.name}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
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
