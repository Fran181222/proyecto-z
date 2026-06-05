# PROYECTO Z — Migración a Next.js
## Guía completa basada en tu código actual (Malibu Joyería)

---

## 1. ¿QUÉ TENÉS AHORA vs QUÉ TENDRÁS

| Actual (HTML/CSS/JS) | Next.js equivalente |
|---|---|
| `index.html` | `app/page.jsx` |
| `productos.html` | `app/productos/page.jsx` |
| `producto.html` | `app/productos/[id]/page.jsx` |
| `sets.html` | `app/sets/page.jsx` |
| `carrito.html` | `app/carrito/page.jsx` |
| `admin.html` | `app/admin/page.jsx` |
| `menu.html` | `app/menu/page.jsx` |
| `style.css` | `app/globals.css` + módulos CSS |
| `main.js` + `auth.js` | Hooks de React (`useCart`, `useAuth`) |
| jQuery (`$`) | Estado de React (`useState`, `useEffect`) |
| Bootstrap | Tailwind CSS (recomendado) o Bootstrap igual |

---

## 2. ESTRUCTURA DE CARPETAS DEL PROYECTO

```
proyecto-z/
│
├── app/                          ← App Router de Next.js 14+
│   ├── layout.jsx                ← Layout global (navbar + footer + modales)
│   ├── page.jsx                  ← Home (index.html)
│   ├── globals.css               ← Tu style.css migrado
│   │
│   ├── productos/
│   │   ├── page.jsx              ← Catálogo (productos.html)
│   │   └── [id]/
│   │       └── page.jsx          ← Ficha de producto (producto.html)
│   │
│   ├── sets/
│   │   └── page.jsx              ← Sets (sets.html)
│   │
│   ├── carrito/
│   │   └── page.jsx              ← Carrito (carrito.html)
│   │
│   ├── admin/
│   │   └── page.jsx              ← Panel admin (admin.html)
│   │
│   ├── menu/
│   │   └── page.jsx              ← Menú (menu.html)
│   │
│   └── gift-card/
│       └── page.jsx              ← NUEVO: Gift Cards (Punto 5)
│
├── components/                   ← Componentes reutilizables
│   ├── layout/
│   │   ├── Navbar.jsx            ← Tu <nav class="site-navbar">
│   │   ├── Footer.jsx            ← Tu <footer class="footer-shell">
│   │   └── Topbar.jsx            ← Tu <div class="topbar">
│   │
│   ├── ui/
│   │   ├── CartDrawer.jsx        ← Tu offcanvas del carrito
│   │   ├── AuthModal.jsx         ← Tu modal de login/registro
│   │   ├── WelcomePopup.jsx      ← NUEVO: Popup de bienvenida con descuento (Punto 4)
│   │   └── GiftCard.jsx          ← NUEVO: Sección Gift Cards (Punto 5)
│   │
│   ├── home/
│   │   ├── HeroGrid.jsx          ← Tu hero-grid
│   │   ├── JewelCards.jsx        ← Tus jewel-card
│   │   ├── SetsCarousel.jsx      ← Tu carousel de sets
│   │   ├── CollectionTowers.jsx  ← NUEVO: Las 3 torres (Punto 6)
│   │   └── TrendingSection.jsx   ← NUEVO: Tendencias con imágenes (Punto 9)
│   │
│   ├── product/
│   │   ├── ProductGallery.jsx    ← Tu detail-gallery (thumbs a la izquierda - Punto 8)
│   │   ├── SizeSelector.jsx      ← Tu size-selector con precio dinámico (Punto 7)
│   │   ├── ReviewSection.jsx     ← NUEVO: Comentarios/Testimonios (Punto 1)
│   │   ├── RelatedProducts.jsx   ← NUEVO: Productos similares (Punto 13)
│   │   └── Breadcrumb.jsx        ← NUEVO: Ruta jerárquica (Punto 11)
│   │
│   └── catalog/
│       ├── ProductCard.jsx       ← Tarjeta con ícono carrito (Punto 12)
│       └── FilterPanel.jsx       ← NUEVO: Filtros (Punto 14)
│
├── context/                      ← Estado global
│   ├── CartContext.jsx           ← Reemplaza tu lógica jQuery del carrito
│   └── AuthContext.jsx           ← Reemplaza tu auth.js
│
├── data/                         ← Datos locales (mientras no hay backend)
│   └── products.js               ← Array de productos con todas las propiedades
│
├── public/
│   └── img/                      ← Tus imágenes actuales van acá
│
└── package.json
```

---

## 3. CÓMO INSTALAR EL PROYECTO

```bash
# 1. Crear el proyecto
npx create-next-app@latest proyecto-z

# Opciones que te va a preguntar:
# ✅ TypeScript? → NO (por ahora, aprendé JS primero)
# ✅ ESLint? → SÍ
# ✅ Tailwind CSS? → SÍ
# ✅ src/ directory? → NO
# ✅ App Router? → SÍ
# ✅ Import alias? → NO

# 2. Entrar a la carpeta
cd proyecto-z

# 3. Instalar dependencias extra que vas a necesitar
npm install lucide-react          # Íconos (reemplaza Bootstrap Icons)
npm install framer-motion         # Animaciones (reemplaza tus CSS transitions)
npm install zustand               # Estado global simple (carrito, auth)

# 4. Correr en desarrollo
npm run dev
# → Abre http://localhost:3000
```

---

## 4. MIGRACIÓN DE TU LÓGICA ACTUAL

### De jQuery a React — Casos concretos de tu código

---

#### TU CÓDIGO ACTUAL (main.js) — Selector de talle:
```javascript
// jQuery
$(".size-chip").on("click", function () {
  $chip.closest(".size-selector").find(".size-chip").removeClass("active");
  $chip.addClass("active");
  $(".selected-size-label").text(`Talle ${selectedSize}`);
});
```

#### EQUIVALENTE EN REACT (SizeSelector.jsx):
```jsx
// React con precio dinámico por talle (Punto 7 del Proyecto Z)
const PRICES_BY_SIZE = {
  "12": 2400,
  "14": 2600,
  "16": 2900,
  "18": 3200,
};

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState("14");
  const price = PRICES_BY_SIZE[selectedSize];

  return (
    <div>
      <div className="size-selector">
        {Object.keys(PRICES_BY_SIZE).map((size) => (
          <button
            key={size}
            className={`size-chip ${selectedSize === size ? "active" : ""}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <p className="detail-price">${price.toLocaleString("es-AR")}</p>
      <p>Talle seleccionado: {selectedSize}</p>
    </div>
  );
}
```

---

#### TU CÓDIGO ACTUAL (main.js) — Galería de imágenes:
```javascript
// jQuery
$(".detail-thumb-toggle").on("click", function () {
  const imageSrc = $trigger.data("image");
  $gallery.find(".detail-main-image img").attr({ src: imageSrc });
  $gallery.find(".detail-thumb").removeClass("active");
  $trigger.closest(".detail-thumb").addClass("active");
});
```

#### EQUIVALENTE EN REACT (ProductGallery.jsx) — Con thumbs a la izquierda (Punto 8):
```jsx
export default function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="detail-gallery" style={{ display: "flex", gap: "1rem" }}>
      {/* Thumbs a la IZQUIERDA (Punto 8) */}
      <div className="detail-thumb-col" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {images.map((img) => (
          <button
            key={img.src}
            className={`detail-thumb ${mainImage.src === img.src ? "active" : ""}`}
            onClick={() => setMainImage(img)}
          >
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="detail-main-image" style={{ flex: 1 }}>
        <img src={mainImage.src} alt={mainImage.alt} />
      </div>
    </div>
  );
}
```

---

#### TU CÓDIGO ACTUAL (auth.js) — Login con jQuery:
```javascript
// jQuery — 80 líneas de código
$loginForm.on("submit", function (event) {
  event.preventDefault();
  // validaciones manuales...
  sessionStorage.setItem(accessKey, "true");
});
```

#### EQUIVALENTE EN REACT (AuthContext.jsx):
```jsx
// React Context — limpio y reutilizable en toda la app
"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (email, password) => {
    // Tu validación actual, igual de simple
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8) {
      setUser({ email });
      setIsModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isModalOpen, setIsModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar en cualquier componente
export const useAuth = () => useContext(AuthContext);
```

---

#### CARRITO — CartContext.jsx (reemplaza tu lógica jQuery):
```jsx
"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsOpen(true); // Abre el drawer automáticamente
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

---

## 5. DATOS DE PRODUCTOS (data/products.js)

```javascript
// Reemplaza tus datos hardcodeados en el HTML
export const products = [
  {
    id: "aros-corazon-celeste",
    name: "Aros Corazón Celeste",
    category: "Aros",
    collection: "italianas",        // Para las torres (Punto 6)
    subcollection: "pulseras",      // Para breadcrumb (Punto 11)
    plan: "Plan Oro",               // Para breadcrumb (Punto 11)
    price: 2600,                    // Precio base
    pricesBySize: {                 // Precios por talle (Punto 7)
      "12": 2400,
      "14": 2600,
      "16": 2900,
      "18": 3200,
    },
    stock: 8,
    images: [
      { src: "/img/aros-corazon-celeste.gif", alt: "Vista frontal" },
      { src: "/img/aros-corazon-celeste(2).jpg", alt: "Detalle lateral" },
      { src: "/img/aros-corazon-celeste(3).jpg", alt: "Textura" },
    ],
    desc: "Aros con forma de corazón en tono celeste, ideal para uso diario.",
    tags: ["dorado", "aros"],       // Para filtros (Punto 14)
    filters: {
      color: "dorado",
      categoria: "para-compartir",
    },
    reviews: [],                    // Array de reseñas (Punto 1)
    relatedIds: [],                 // IDs de productos similares (Punto 13)
  },
  // ... más productos
];

export const collections = [
  {
    id: "italianas",
    name: "Italianas",
    subtitle: "Pulseras, charms y herramientas",
    image: "/img/display-shiny-elegant-gold-chain.jpg",
    href: "/productos?coleccion=italianas",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    subtitle: "Anillos, pulseras, collares, bufandones",
    image: "/img/expensive-golden-ring-displayed-white-coral-background.jpg",
    href: "/productos?coleccion=accesorios",
  },
  {
    id: "materiales",
    name: "Materiales",
    subtitle: "Insumos y materiales de trabajo",
    image: "/img/display-shiny-luxurious-golden-chain.jpg",
    href: "/productos?coleccion=materiales",
  },
];
```

---

## 6. POPUP DE BIENVENIDA (Punto 4 — WelcomePopup.jsx)

```jsx
"use client";
import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo una vez por sesión, igual que tu sessionStorage actual
    const seen = sessionStorage.getItem("welcome_seen");
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("welcome_seen", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <button className="welcome-close" onClick={handleClose}>✕</button>
        <p className="mini-label">Bienvenida a Malibu</p>
        <h3>10% OFF en tu primera compra</h3>
        <p>Registrate y recibí tu descuento exclusivo por correo.</p>
        <input type="email" placeholder="tuemail@email.com" />
        <button className="btn-mali btn-gold w-100" onClick={handleClose}>
          Quiero mi descuento
        </button>
        <button className="btn-link" onClick={handleClose}>
          No gracias
        </button>
      </div>
    </div>
  );
}
```

---

## 7. SECCIÓN DE RESEÑAS (Punto 1 — ReviewSection.jsx)

```jsx
"use client";
import { useState } from "react";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([
    { id: 1, name: "Laura M.", rating: 5, comment: "Hermosos, llegaron perfectos y el packaging divino!", date: "2025-05-10" },
    { id: 2, name: "Sofía R.", rating: 4, comment: "Muy buena calidad, los uso todos los días.", date: "2025-04-28" },
  ]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0] };
    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
  };

  return (
    <section className="review-section">
      <h3>Reseñas del producto</h3>

      {/* Lista de reseñas */}
      <div className="reviews-list">
        {reviews.map((r) => (
          <article key={r.id} className="review-card">
            <div className="review-header">
              <strong>{r.name}</strong>
              <span>{"⭐".repeat(r.rating)}</span>
              <time>{r.date}</time>
            </div>
            <p>{r.comment}</p>
          </article>
        ))}
      </div>

      {/* Formulario para nueva reseña */}
      <div className="review-form-wrapper">
        <h4>Dejá tu opinión</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} estrellas</option>
            ))}
          </select>
          <textarea
            placeholder="¿Qué te pareció el producto?"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
          <button className="btn-mali btn-gold" type="submit">
            Publicar reseña
          </button>
        </form>
      </div>
    </section>
  );
}
```

---

## 8. FILTROS DEL CATÁLOGO (Punto 14 — FilterPanel.jsx)

```jsx
"use client";
import { useState } from "react";

const FILTER_CATEGORIES = ["Para compartir", "De viajes", "Ojos turcos", "Signos zodiacales"];
const FILTER_COLORS = ["Dorado", "Plateado", "Rose Gold"];

export default function FilterPanel({ onFilterChange }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeColor, setActiveColor] = useState(null);

  const handleFilter = (type, value) => {
    const newCategory = type === "category" ? value : activeCategory;
    const newColor = type === "color" ? value : activeColor;
    setActiveCategory(newCategory);
    setActiveColor(newColor);
    onFilterChange({ category: newCategory, color: newColor });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <h6>Categoría</h6>
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleFilter("category", activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <h6>Color</h6>
        {FILTER_COLORS.map((color) => (
          <button
            key={color}
            className={`filter-btn color-btn ${activeColor === color ? "active" : ""}`}
            onClick={() => handleFilter("color", activeColor === color ? null : color)}
          >
            <span className={`color-dot ${color.toLowerCase().replace(" ", "-")}`}></span>
            {color}
          </button>
        ))}
      </div>
    </aside>
  );
}
```

---

## 9. BREADCRUMB DE PRODUCTO (Punto 11 — Breadcrumb.jsx)

```jsx
// Muestra: Plan Oro > Pulseras > Aros Corazón Celeste
export default function Breadcrumb({ plan, collection, productName }) {
  return (
    <nav className="product-breadcrumb" aria-label="Ruta del producto">
      <span>{plan}</span>
      <span className="breadcrumb-sep">›</span>
      <span>{collection}</span>
      <span className="breadcrumb-sep">›</span>
      <span className="breadcrumb-current">{productName}</span>
    </nav>
  );
}

// Uso en la página de producto:
// <Breadcrumb plan="Plan Oro" collection="Pulseras" productName="Aros Corazón Celeste" />
```

---

## 10. TARJETA DE CATÁLOGO CON ÍCONO CARRITO (Punto 12 — ProductCard.jsx)

```jsx
"use client";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="jewel-card">
      <div className="jewel-media">
        <img src={product.images[0].src} alt={product.name} />
        {/* Ícono carrito sobre la imagen */}
        <button
          className="card-cart-btn"
          onClick={() => addItem(product)}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          🛒
        </button>
      </div>
      <div className="jewel-meta">
        <span className="mini-label">{product.category}</span>
        <h4>{product.name}</h4>
        <p>{product.desc}</p>
        <div className="price-row">
          <strong>${product.price.toLocaleString("es-AR")}</strong>
          <a href={`/productos/${product.id}`} className="btn-mali btn-outline-mali">
            Ver más
          </a>
        </div>
      </div>
    </article>
  );
}
```

---

## 11. LAYOUT GLOBAL (app/layout.jsx)

```jsx
// Este archivo envuelve TODAS las páginas
// Equivale a tener el navbar y footer en cada HTML, pero una sola vez
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Topbar from "@/components/layout/Topbar";
import CartDrawer from "@/components/ui/CartDrawer";
import AuthModal from "@/components/ui/AuthModal";
import WelcomePopup from "@/components/ui/WelcomePopup";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <WelcomePopup />        {/* Popup de bienvenida — Punto 4 */}
            <Topbar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />          {/* Drawer lateral del carrito */}
            <AuthModal />           {/* Modal de login/registro */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 12. REDES SOCIALES — Solo IG, TikTok y WhatsApp (Punto 3)

```jsx
// En Footer.jsx
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/TU_USUARIO",
    icon: "bi-instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@TU_USUARIO",
    icon: "bi-tiktok",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/5491155552026",  // Reemplazá con tu número
    icon: "bi-whatsapp",
  },
];

// En el JSX del footer:
{SOCIAL_LINKS.map((social) => (
  <a
    key={social.name}
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={social.name}
    className="social-icon"
  >
    <i className={`bi ${social.icon}`}></i>
  </a>
))}
```

---

## 13. MIGRACIÓN DE TU CSS

Tu `style.css` de 2214 líneas se migra así:

```
style.css → app/globals.css
```

**Solo tenés que:**
1. Copiar todo el contenido de `style.css` a `app/globals.css`
2. Las clases funcionan igual (`.btn-mali`, `.jewel-card`, `.detail-gallery`, etc.)
3. Para los colores y variables CSS, ya los tenés como `:root { --var: value; }` → funcionan igual

**A futuro** podés dividirlo en módulos:
```
styles/
  navbar.module.css
  product.module.css
  cart.module.css
```

---

## 14. CHECKLIST DE MIGRACIÓN — En orden de dificultad

### 🟢 Fácil (empezá acá)
- [ ] Crear proyecto con `create-next-app`
- [ ] Copiar `style.css` → `globals.css`
- [ ] Copiar imágenes a `/public/img/`
- [ ] Crear `data/products.js` con tus productos
- [ ] Migrar `index.html` → `app/page.jsx`

### 🟡 Medio
- [ ] Crear `CartContext.jsx` y `AuthContext.jsx`
- [ ] Crear `Navbar.jsx`, `Footer.jsx`, `Topbar.jsx`
- [ ] Migrar `productos.html` → `app/productos/page.jsx`
- [ ] Migrar `producto.html` → `app/productos/[id]/page.jsx`
- [ ] Agregar `ProductGallery.jsx` con thumbs a la izquierda

### 🔴 Avanzado (una vez que tenés la base)
- [ ] `SizeSelector.jsx` con precios dinámicos por talle
- [ ] `ReviewSection.jsx` por producto
- [ ] `FilterPanel.jsx` con categorías y colores
- [ ] `WelcomePopup.jsx` con descuento
- [ ] `CollectionTowers.jsx` con las 3 torres
- [ ] `GiftCard` page
- [ ] Panel de admin en React

---

## 15. RECURSOS PARA APRENDER

| Tema | Recurso |
|---|---|
| Next.js desde cero | https://nextjs.org/learn |
| React hooks (useState, useEffect) | https://react.dev/learn |
| Tailwind CSS | https://tailwindcss.com/docs |
| Context API (carrito y auth) | https://react.dev/reference/react/createContext |
| Deploy gratis en Vercel | https://vercel.com |

---

## RESUMEN EJECUTIVO

Tu proyecto actual es una base **muy sólida**. El diseño, las clases CSS y la estructura visual ya están bien pensados. La migración a Next.js no es reescribir todo desde cero: es **trasladar lo que ya funciona a una arquitectura más escalable**.

El cambio más grande es conceptual: en lugar de jQuery manipulando el DOM, usás **estado de React** que actualiza la UI automáticamente. Todo lo demás (clases CSS, estructura HTML, lógica de negocio) se mantiene prácticamente igual.

**Tiempo estimado de migración:** 3 a 5 semanas a ritmo de estudiante, haciendo el checklist en orden.