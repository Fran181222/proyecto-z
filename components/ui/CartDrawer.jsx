"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="offcanvas-backdrop fade show"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className="offcanvas offcanvas-end cart-offcanvas show"
        tabIndex="-1"
        aria-labelledby="cartDrawerLabel"
        style={{ visibility: "visible" }}
      >
        <div className="offcanvas-header">
          <div>
            <p className="mini-label mb-1">Carrito Malibu</p>
            <h4 id="cartDrawerLabel" className="mb-0">
              Tu selección actual
            </h4>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
          />
        </div>

        <div className="offcanvas-body">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-bag-shopping fs-1 mb-3 d-block" style={{ opacity: 0.3 }}></i>
              <p className="text-secondary">Tu carrito está vacío.</p>
              <button
                className="btn-mali btn-gold mt-2"
                onClick={() => setIsOpen(false)}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <img
                      src={item.images?.[0]?.src || "/img/display-shiny-elegant-gold-chain.jpg"}
                      alt={item.name}
                    />
                    <div style={{ flex: 1 }}>
                      <h5>{item.name}</h5>
                      <p>{item.desc}</p>
                      <div className="cart-item-footer">
                        <strong>${(item.price * item.qty).toLocaleString("es-AR")}</strong>
                        <div className="cart-qty">
                          <button
                            className="cart-qty-btn"
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="cart-qty-value">{item.qty}</span>
                          <button
                            className="cart-qty-btn"
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}
                          aria-label="Eliminar"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-summary-box">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <strong>${total.toLocaleString("es-AR")}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Envío premium</span>
                  <span>Gratis</span>
                </div>
                <div className="cart-summary-row">
                  <span>Total</span>
                  <strong>${total.toLocaleString("es-AR")}</strong>
                </div>
                <p className="drawer-note mt-3 mb-3">
                  Podés seguir navegando o ir al detalle completo del carrito.
                </p>
                <div className="d-grid gap-3">
                  <Link
                    className="btn-mali btn-gold w-100"
                    href="/carrito"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fa-solid fa-arrow-right"></i>Ir al carrito
                  </Link>
                  <button
                    className="btn-mali btn-outline-mali w-100"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
