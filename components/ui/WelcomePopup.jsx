"use client";
import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("welcome_seen");
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("welcome_seen", "true");
    setIsVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(handleClose, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 9998, backdropFilter: "blur(4px)",
        }}
        onClick={handleClose}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999, width: "min(480px, 92vw)",
          background: "var(--surface-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "1.25rem", opacity: 0.5,
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <p className="mini-label mb-2">Bienvenida a Malibu ✨</p>
            <h3 className="mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              10% OFF en tu primera compra
            </h3>
            <p className="text-secondary mb-4">
              Registrá tu email y recibí tu código de descuento exclusivo al instante.
            </p>
            <form onSubmit={handleSubmit} className="d-grid gap-3">
              <input
                className="form-control"
                type="email"
                placeholder="tuemail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn-mali btn-gold w-100" type="submit">
                <i className="bi bi-gift me-2"></i>Quiero mi descuento
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", opacity: 0.5, fontSize: "0.85rem",
                }}
              >
                No gracias, continuar sin descuento
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-3">
            <p style={{ fontSize: "2.5rem" }}>🎉</p>
            <h4>¡Listo! Revisá tu correo.</h4>
            <p className="text-secondary">Tu código de descuento está en camino.</p>
          </div>
        )}
      </div>
    </>
  );
}