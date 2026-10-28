"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);
  const extraCount = Math.max(images.length - 4, 0);

  return (
    <div className="detail-gallery">
      <div className="detail-thumb-rail" aria-label="Imagenes del producto">
        {images.slice(0, 5).map((img, index) => (
          <button
            key={img.src}
            onClick={() => setMainImage(img)}
            className={`detail-thumb ${mainImage.src === img.src ? "active" : ""}`}
            aria-label={img.alt}
            type="button"
          >
            <Image src={img.src} alt={img.alt} fill sizes="100px" />
            {index === 4 && extraCount > 0 && (
              <span className="detail-thumb-more">+{extraCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="detail-main-image">
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          fill
          sizes="(max-width: 992px) 100vw, 50vw"
          preload
        />
        <div className="detail-gallery-dots" aria-hidden="true">
          {images.map((img) => (
            <span
              className={mainImage.src === img.src ? "active" : ""}
              key={img.src}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
