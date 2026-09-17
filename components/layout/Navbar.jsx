"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openModal, user, logout } = useAuth();
  const { itemCount, setIsOpen, isHydrated } = useCart();

  const navLinks = [
    { href: "/productos", label: "Productos" },
    { href: "/sets", label: "Sets" },
    { href: "/menu", label: "Menu" },
  ];

  return (
    <nav className="navbar navbar-expand-lg site-navbar">
      <div className="container nav-shell py-2">
        <Link className="navbar-brand" href="/">
          <span className="brand-logo" aria-hidden="true">
            <span className="brand-logo-word">MAL</span>
            <span className="brand-logo-word">IBU</span>
          </span>
          <span className="visually-hidden">Malibu</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse nav-menu" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Colecciones
              </a>
              <div className="dropdown-menu mega-menu">
                <div className="row g-4">
                  <div className="col-lg-3">
                    <div className="mega-card">
                      <div className="mega-links">
                        <span className="mini-label">Tendencias</span>
                        <Link href="/productos?coleccion=italianas">Italianas</Link>
                        <Link href="/productos?coleccion=accesorios">Charms</Link>
                        <Link href="/productos?coleccion=materiales">Herramientas</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 mega-links">
                    <h6 className="fw-bold mb-3">Accesorios</h6>
                    <Link href="/productos?coleccion=italianas">Pulseras</Link>
                    <Link href="/productos?coleccion=accesorios">Collares</Link>
                    <Link href="/productos?coleccion=materiales">Bufandones</Link>
                    <Link href="/sets">Sets</Link>
                  </div>
                  <div className="col-lg-3 mega-links">
                    <h6 className="fw-bold mb-3">Materiales</h6>
                    <Link href="/productos?categoria=regalos">Oro</Link>
                    <Link href="/productos?categoria=uso-diario">Plata</Link>
                    <Link href="/productos?categoria=edicion-limitada">Rose Gold</Link>
                    <Link href="/gift-card">Gift Cards</Link>
                  </div>
                  <div className="col-lg-3">
                    <img
                      className="mega-menu-image"
                      src="/img/expensive-golden-ring-displayed-white-coral-background.jpg"
                      alt="Coleccion Malibu"
                    />
                  </div>
                </div>
              </div>
            </li>

            {navLinks.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  className={`nav-link ${pathname === link.href ? "active" : ""}`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="nav-item">
              <a className="nav-link" href="#footer-contacto">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div className="nav-utility">
          <form className="nav-search-shell" aria-label="Buscador">
            <input
              className="nav-search-input"
              type="search"
              placeholder="Buscar pieza o set"
              aria-label="Buscar"
            />
            <button className="nav-search-submit" type="submit" aria-label="Buscar">
              <Search size={18} />
            </button>
          </form>

          {user ? (
            <button
              className="btn-mali btn-outline-mali user-access-btn"
              onClick={logout}
              aria-label="Cerrar sesion"
            >
              <UserCheck size={19} />
            </button>
          ) : (
            <button
              className="btn-mali btn-outline-mali user-access-btn"
              onClick={() => openModal("login")}
              aria-label="Abrir acceso de usuario"
            >
              <User size={19} />
            </button>
          )}

          <button
            className="btn-mali btn-outline-mali icon-action-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={19} />
            {isHydrated && itemCount > 0 && (
              <span className="cart-count-badge">{itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
