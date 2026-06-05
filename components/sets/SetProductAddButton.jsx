"use client";

import { useCart } from "@/context/CartContext";

export default function SetProductAddButton({ product }) {
  const { addItem } = useCart();

  return (
    <button
      className="set-product-cart-btn"
      type="button"
      onClick={() => addItem(product)}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      <i className="fa-solid fa-bag-shopping"></i>
    </button>
  );
}
