"use client";
import { useState } from "react";

const CATEGORIES = ["Para compartir", "De viajes", "Ojos turcos", "Signos zodiacales"];
const COLORS = [
  { label: "Dorado", hex: "#C9A84C" },
  { label: "Plateado", hex: "#A8A8A8" },
  { label: "Rose Gold", hex: "#C4847A" },
];
const COLLECTIONS = ["Todas", "italianas", "accesorios", "materiales"];

export default function FilterPanel({ onFilterChange }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [activeCollection, setActiveCollection] = useState("Todas");
  const [isOpen, setIsOpen] = useState(false);

  const applyFilter = (cat, color, col) => {
    onFilterChange({
      category: cat,
      color: color,
      collection: col === "Todas" ? null : col,
    });
  };

  const handleCategory = (cat) => {
    const next = activeCategory === cat ? null : cat;
    setActiveCategory(next);
    applyFilter(next, activeColor, activeCollection);
  };

  const handleColor = (color) => {
    const next = activeColor === color ? null : color;
    setActiveColor(next);
    applyFilter(activeCategory, next, activeCollection);
  };

  const handleCollection = (col) => {
    setActiveCollection(col);
    applyFilter(activeCategory, activeColor, col);
  };

  const clearAll = () => {
    setActiveCategory(null);
    setActiveColor(null);
    setActiveCollection("Todas");
    onFilterChange({ category: null, color: null, collection: null });
  };

  const hasFilters = activeCategory || activeColor || activeCollection !== "Todas";

  return (
    <aside>
      {/* Toggle en mobile */}
      <button
        className="btn-mali btn-outline-mali w-100 d-lg-none mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`bi bi-funnel me-2`}></i>
        Filtros
        {hasFilters && (
          <span
            style={{
              background: "var(--gold)",
              color: "white",
              borderRadius: "99px",
              padding: "0.1rem 0.5rem",
              fontSize: "0.72rem",
              marginLeft: "0.5rem",
            }}
          >
            Activos
          </span>
        )}
      </button>

      <div className={`filter-panel-body ${isOpen ? "d-block" : "d-none d-lg-block"}`}>
        {/* Colección */}
        <div className="filter-group mb-4">
          <h6
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "0.75rem",
            }}
          >
            Colección
          </h6>
          <div className="d-flex flex-column gap-2">
            {COLLECTIONS.map((col) => (
              <button
                key={col}
                className={`filter-btn text-start ${activeCollection === col ? "active" : ""}`}
                onClick={() => handleCollection(col)}
                style={{
                  background:
                    activeCollection === col ? "var(--gold)" : "var(--surface)",
                  color: activeCollection === col ? "white" : "inherit",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.85rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría */}
        <div className="filter-group mb-4">
          <h6
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "0.75rem",
            }}
          >
            Categoría
          </h6>
          <div className="d-flex flex-column gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn text-start ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleCategory(cat)}
                style={{
                  background:
                    activeCategory === cat ? "var(--gold)" : "var(--surface)",
                  color: activeCategory === cat ? "white" : "inherit",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.85rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="filter-group mb-4">
          <h6
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "0.75rem",
            }}
          >
            Color
          </h6>
          <div className="d-flex flex-column gap-2">
            {COLORS.map(({ label, hex }) => (
              <button
                key={label}
                onClick={() => handleColor(label)}
                style={{
                  background:
                    activeColor === label ? "var(--gold)" : "var(--surface)",
                  color: activeColor === label ? "white" : "inherit",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.85rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: hex,
                    border: "1px solid rgba(0,0,0,0.15)",
                    flexShrink: 0,
                  }}
                />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={clearAll}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem 0.85rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              opacity: 0.6,
              width: "100%",
            }}
          >
            <i className="bi bi-x-circle me-2"></i>Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}