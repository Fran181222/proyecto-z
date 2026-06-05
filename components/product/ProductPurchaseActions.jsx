"use client";

import { useMemo, useState } from "react";
import SizeSelector from "@/components/product/SizeSelector";
import { useCart } from "@/context/CartContext";

export default function ProductPurchaseActions({ product }) {
  const sizes = useMemo(
    () => (product.pricesBySize ? Object.keys(product.pricesBySize) : []),
    [product.pricesBySize]
  );
  const initialSize = sizes[1] || sizes[0] || null;
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [price, setPrice] = useState(
    initialSize ? product.pricesBySize[initialSize] : product.price
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const selectedProduct = {
    ...product,
    id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
    name: selectedSize ? `${product.name} - Talle ${selectedSize}` : product.name,
    price,
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem(selectedProduct);
    }
  };

  return (
    <div className="detail-purchase-panel">
      <SizeSelector
        pricesBySize={product.pricesBySize}
        basePrice={product.price}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        onPriceChange={setPrice}
      />

      <div className="detail-buy-row">
        <div className="detail-qty-control" aria-label="Cantidad">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Restar cantidad"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="Sumar cantidad"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <button className="detail-add-button" type="button" onClick={handleAdd}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
