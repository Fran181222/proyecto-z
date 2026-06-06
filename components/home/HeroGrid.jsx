"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ROTATING_WORDS = ["brillo costero", "oro artesanal", "piezas icónicas", "elegancia diaria"];

const BEST_SELLERS = [
  {
    id: 1,
    label: "Top 01",
    name: "Set Golden Shore",
    desc: "Collar y anillo con brillo pulido, ideal para elevar looks de día y noche.",
    image: "/img/display-shiny-elegant-gold-chain.jpg",
    href: "/sets",
    btnLabel: "Entrar a sets",
  },
  {
    id: 2,
    label: "Top 02",
    name: "Anillo Coral Luxe",
    desc: "Una pieza protagonista con piedra coral y acabado luminoso de lujo.",
    image: "/img/expensive-golden-ring-displayed-white-coral-background.jpg",
    href: "/productos/anillo-coral-glow",
    btnLabel: "Ver detalles",
  },
  {
    id: 3,
    label: "Top 03",
    name: "Cadena Pacific Glow",
    desc: "Diseño versátil para layering sofisticado con textura de alto brillo.",
    image: "/img/vista-arriba-cadenas-oro-naturaleza-muerta_23-2149560671.avif",
    href: "/productos/cadena-pacific-glow",
    btnLabel: "Sumar a wishlist",
  },
];

export default function HeroGrid() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [sellerIndex, setSellerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 200);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const prevSeller = () =>
    setSellerIndex((i) => (i - 1 + BEST_SELLERS.length) % BEST_SELLERS.length);
  const nextSeller = () =>
    setSellerIndex((i) => (i + 1) % BEST_SELLERS.length);

  const seller = BEST_SELLERS[sellerIndex];

  return (
    <section className="section-space">
      <div className="container">
        <div className="hero-grid">
          {/* Panel izquierdo — Oferta */}
          <article className="hero-panel hero-offer">
            <img
              src="/img/imagen-titulo.png"
              alt="Oferta destacada"
            />
            <div className="hero-offer-content">
              <div className="offer-badge">Oferta Malibu</div>
              <div className="hero-offer-copy">
                <p className="section-tag mb-3">Hasta 35% OFF en sets seleccionados</p>
                <h1>Todo para ustedes</h1>
                <p className="lead mb-4">
                  Cápsulas exclusivas con acabado premium, packaging regalo y cuotas sin interés.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link className="btn-mali btn-gold" href="/productos">
                    Ver ofertas
                  </Link>
                  <Link
                    className="btn-mali btn-outline-mali text-white border-white"
                    href="/sets"
                  >
                    Explorar sets
                  </Link>
                </div>
              </div>
              <div className="floating-chip">
                <i className="bi bi-gem"></i>
                Curaduría artesanal con inspiración costera.
              </div>
            </div>
          </article>

          {/* Panel derecho — Más vendidos */}
          <article className="hero-panel hero-sellers">
            <div className="hero-sellers-content">
              <div>
                <p className="section-tag mb-3">
                  <i className="bi bi-fire"></i> Más vendidos
                </p>
                <div className="rotating-wrapper">
                  <span></span>
                  <strong
                    className="rotating-text"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </strong>
                </div>
                <h2>El carrusel favorito de quienes eligen Malibu.</h2>
              </div>

              {/* Seller card manual (sin Bootstrap carousel) */}
              <div className="seller-card">
                <div className="seller-card-copy">
                  <span className="mini-label">{seller.label}</span>
                  <h3 className="mt-3">{seller.name}</h3>
                  <p className="mb-4">{seller.desc}</p>
                  <Link className="btn-mali btn-gold" href={seller.href}>
                    <i className="bi bi-box-arrow-up-right"></i>
                    {seller.btnLabel}
                  </Link>
                </div>
                <div className="seller-card-visual">
                  <img src={seller.image} alt={seller.name} />
                </div>
              </div>

              <div className="seller-carousel-controls">
                <span className="seller-note">
                  Visuales protagonistas con un encuadre editorial.
                </span>
                <div className="seller-carousel-nav">
                  <button
                    className="btn-mali btn-outline-mali p-3"
                    type="button"
                    onClick={prevSeller}
                    aria-label="Anterior"
                  >
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <button
                    className="btn-mali btn-outline-mali p-3"
                    type="button"
                    onClick={nextSeller}
                    aria-label="Siguiente"
                  >
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>

              {/* Métricas */}
              <div className="hero-metrics">
                <div className="metric-pill">
                  <strong>4.9/5</strong>
                  <div className="small">Clientes felices</div>
                </div>
                <div className="metric-pill">
                  <strong>+180</strong>
                  <div className="small">Sets vendidos este mes</div>
                </div>
                <div className="metric-pill">
                  <strong>48h</strong>
                  <div className="small">Envío express</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}