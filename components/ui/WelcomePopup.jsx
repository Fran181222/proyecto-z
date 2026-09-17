"use client";
import { useEffect, useState } from "react";
import { Gift, PartyPopper, Sparkles, X } from "lucide-react";

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
    return undefined;
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
      <div className="welcome-backdrop" onClick={handleClose} />
      <div className="welcome-popup">
        <button className="welcome-close" onClick={handleClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <p className="mini-label mb-2">
              <Sparkles size={16} />
              Bienvenida a Malibu
            </p>
            <h3 className="mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              10% OFF en tu primera compra
            </h3>
            <p className="text-secondary mb-4">
              Registra tu email y recibi tu codigo de descuento exclusivo al instante.
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
                <Gift size={18} />Quiero mi descuento
              </button>
              <button className="welcome-skip" type="button" onClick={handleClose}>
                No gracias, continuar sin descuento
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-3">
            <PartyPopper className="welcome-success-icon mb-3" size={42} />
            <h4>Listo, revisa tu correo.</h4>
            <p className="text-secondary">Tu codigo de descuento esta en camino.</p>
          </div>
        )}
      </div>
    </>
  );
}
