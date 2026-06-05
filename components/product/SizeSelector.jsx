"use client";

import { useState } from "react";

export default function SizeSelector({
  pricesBySize,
  basePrice,
  selectedSize: controlledSize,
  onSizeChange,
  onPriceChange,
}) {
  const sizes = pricesBySize ? Object.keys(pricesBySize) : [];
  const [internalSize, setInternalSize] = useState(sizes[1] || sizes[0] || null);
  const selectedSize = controlledSize ?? internalSize;

  if (!sizes.length) {
    return (
      <div className="detail-selector-row">
        <div className="selector-label-group">
          <span className="selector-label">Variante</span>
          <span className="size-helper">Talle unico, precio fijo</span>
        </div>
        <strong className="selected-size-label">
          ${basePrice.toLocaleString("es-AR")}
        </strong>
      </div>
    );
  }

  const handleSelect = (size) => {
    setInternalSize(size);
    if (onSizeChange) onSizeChange(size);
    if (onPriceChange) onPriceChange(pricesBySize[size]);
  };

  return (
    <div className="detail-selector-row">
      <div className="selector-label-group">
        <span className="selector-label">Talle</span>
        {selectedSize && (
          <span className="size-helper">
            Talle {selectedSize} - ${pricesBySize[selectedSize].toLocaleString("es-AR")}
          </span>
        )}
      </div>

      <div>
        <div className="size-selector" role="group" aria-label="Seleccionar talle">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-chip ${selectedSize === size ? "active" : ""}`}
              onClick={() => handleSelect(size)}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="size-helper mb-0 mt-2">
          El precio se actualiza segun el talle seleccionado.
        </p>
      </div>
    </div>
  );
}
