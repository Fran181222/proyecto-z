"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sets } from "@/data/products";

export default function SetsCarousel() {
  const [active, setActive] = useState(0);
  const progress = useMemo(
    () => `${((active + 1) / sets.length) * 100}%`,
    [active]
  );

  const move = (direction) => {
    setActive((current) => (current + direction + sets.length) % sets.length);
  };

  return (
    <section className="look-carousel-section">
      <div className="container">
        <div className="look-carousel-header">
          <div>
            <p className="look-eyebrow">Sets Malibu</p>
            <h2>Compra el look e inspirate</h2>
          </div>
          <div className="look-actions">
            <Link className="look-outline-btn" href="/sets">
              Ver todo
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <div className="look-nav">
              <button type="button" onClick={() => move(-1)} aria-label="Set anterior">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Set siguiente">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="look-carousel-track">
          {sets.map((set, index) => (
            <Link
              className={`look-card look-card-${set.accent}`}
              href={`/sets/${set.id}`}
              key={set.id}
              style={{ "--look-offset": active }}
            >
              <img src={set.image} alt={set.title} />
              <div className="look-card-copy">
                <span>{set.title}</span>
                <p>{set.subtitle}</p>
              </div>
              <div className="look-card-badge">
                {set.productIds.length} articulos
                <i className="fa-solid fa-up-right-from-square"></i>
              </div>
              <span className="visually-hidden">Abrir set {index + 1}</span>
            </Link>
          ))}
        </div>

        <div className="look-progress" aria-hidden="true">
          <span style={{ width: progress }} />
        </div>
      </div>
    </section>
  );
}
