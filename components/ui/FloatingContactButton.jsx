"use client";

import { useEffect, useState } from "react";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/malibu.juy/",
    icon: "fa-brands fa-instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@malibu.juy",
    icon: "fa-brands fa-tiktok",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/+5493885088917",
    icon: "fa-brands fa-whatsapp",
  },
];

export default function FloatingContactButton({ links = SOCIAL_LINKS }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    // Dispara el pulso una sola vez, 2 segundos despues del montaje.
    const timer = window.setTimeout(() => {
      setShouldPulse(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClosing) return undefined;

    // Espera a que termine la animacion de cierre antes de ocultar por completo el menu.
    const timer = window.setTimeout(() => {
      setIsClosing(false);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [isClosing]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsClosing(true);
      return;
    }

    setIsClosing(false);
    setIsOpen(true);
  };

  return (
    <div className="floating-contact" aria-label="Redes sociales de Malibu">
      <div
        className={`floating-contact__menu ${
          isOpen ? "is-open" : isClosing ? "is-closing" : "is-closed"
        }`}
        aria-hidden={!isOpen && !isClosing}
      >
        {/* El menu se construye desde un array para poder sumar redes sin cambiar la logica. */}
        {links.map((link, index) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${link.name} en una nueva pestana`}
            title={link.name}
            className="floating-contact__item"
            style={{
              "--floating-index": index,
              "--floating-distance": `calc(${index + 1} * var(--floating-step))`,
            }}
            onClick={() => {
              setIsOpen(false);
              setIsClosing(true);
            }}
          >
            <i className={link.icon} aria-hidden="true"></i>
          </a>
        ))}
      </div>

      <button
        type="button"
        aria-label={isOpen ? "Cerrar redes sociales" : "Abrir redes sociales"}
        title={isOpen ? "Cerrar" : "Contactanos"}
        aria-expanded={isOpen}
        className={`floating-contact__trigger ${
          isOpen ? "is-open" : ""
        } ${shouldPulse ? "is-pulsing" : ""}`}
        onClick={handleToggle}
        onAnimationEnd={() => {
          // Limpia la clase temporal para que el pulso no vuelva a repetirse.
          if (shouldPulse) {
            setShouldPulse(false);
          }
        }}
      >
        <span className="floating-contact__plus" aria-hidden="true">
          +
        </span>
      </button>
    </div>
  );
}
