import Link from "next/link";

const links = [
  { href: "/productos", label: "Productos", icon: "fa-regular fa-gem" },
  { href: "/sets", label: "Sets", icon: "fa-solid fa-layer-group" },
  { href: "/gift-card", label: "Gift Cards", icon: "fa-solid fa-gift" },
  { href: "/carrito", label: "Carrito", icon: "fa-solid fa-bag-shopping" },
];

export const metadata = {
  title: "Malibu Joyeria - Menu",
  description: "Accesos rapidos de Malibu Joyeria.",
};

export default function MenuPage() {
  return (
    <main className="page-shell">
      <section className="section-space">
        <div className="container">
          <p className="section-tag">
            <i className="fa-solid fa-bars me-2"></i>Menu
          </p>
          <h1 className="section-title">Explora Malibu</h1>
          <div className="row g-3 mt-3">
            {links.map((item) => (
              <div className="col-12 col-md-6" key={item.href}>
                <Link className="info-card p-4 d-flex align-items-center gap-3 text-decoration-none" href={item.href}>
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
