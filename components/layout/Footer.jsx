import Link from "next/link";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/TU_USUARIO",
    icon: "fa-brands fa-instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@TU_USUARIO",
    icon: "fa-brands fa-tiktok",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/5491155552026",
    icon: "fa-brands fa-whatsapp",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer-contacto" className="footer-shell">
      <div className="container">
        <div className="row g-4">
          {/* Columna marca */}
          <div className="col-lg-4">
            <div className="footer-card h-100">
              <p className="section-tag mb-3">Malibu Joyería</p>
              <h3 className="mb-3">
                Piezas pensadas para brillar con personalidad.
              </h3>
              <p className="mb-4">
                Atención personalizada, despacho seguro y ediciones premium
                inspiradas en el mar, la arena y el lujo relajado.
              </p>
              <div className="d-flex gap-3 mb-4">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="btn-mali btn-outline-mali"
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="col-lg-5">
            <div className="footer-card h-100">
              <h4 className="mb-3">Formulario de contacto</h4>
              <form className="row g-3">
                <div className="col-12 col-md-6">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Tu email"
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Contanos qué pieza buscás"
                    required
                  ></textarea>
                </div>
                <div className="col-12 d-flex flex-wrap gap-3 align-items-center">
                  <button className="btn-mali btn-gold" type="submit">
                    Enviar consulta
                  </button>
                  <span className="newsletter-note">
                    Te respondemos dentro de 24 horas hábiles.
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="col-lg-3">
            <div className="footer-card h-100">
              <h4 className="mb-3">Accesos</h4>
              <div className="d-grid gap-3">
                <Link
                  href="/productos"
                  className="btn-mali btn-outline-mali justify-content-start text-white"
                >
                  <i className="bi bi-grid"></i>Ver productos
                </Link>
                <Link
                  href="/gift-card"
                  className="btn-mali btn-outline-mali justify-content-start text-white"
                >
                  <i className="bi bi-gift"></i>Gift Cards
                </Link>
                <Link
                  href="/admin"
                  className="btn-mali btn-outline-mali justify-content-start text-white"
                >
                  <i className="bi bi-shield-lock"></i>Panel admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between gap-2">
          <span>© {year} Malibu Joyería. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
