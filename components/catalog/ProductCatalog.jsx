"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Gem, SlidersHorizontal, Sparkles, Wrench, X } from "lucide-react";
import ProductCard from "@/components/catalog/ProductCard";

const FILTER_GROUPS = [
  {
    id: "materials",
    title: "Materiales",
    icon: Gem,
    options: [
      { id: "oro", label: "Oro", aliases: ["oro", "dorado", "gold"] },
      { id: "plata", label: "Plata", aliases: ["plata", "plateado", "silver"] },
      { id: "rose-gold", label: "Rose gold", aliases: ["rose gold", "rose", "oro rosa"] },
    ],
  },
  {
    id: "italianas",
    title: "Italianas",
    icon: Sparkles,
    options: [
      { id: "charms", label: "Charms", aliases: ["charms", "charm"] },
      { id: "herramientas", label: "Herramientas", aliases: ["herramientas", "herramienta"] },
    ],
  },
  {
    id: "accessories",
    title: "Accesorios",
    icon: Wrench,
    options: [
      { id: "anillos", label: "Anillos", aliases: ["anillos", "anillo"] },
      { id: "collares", label: "Collares", aliases: ["collares", "collar", "cadena", "cadenas"] },
      { id: "pulseras", label: "Pulseras", aliases: ["pulseras", "pulsera"] },
      { id: "aros", label: "Aros", aliases: ["aros", "aro"] },
      { id: "bufandones", label: "Bufandones", aliases: ["bufandones", "bufandon"] },
    ],
  },
];

const INITIAL_OPEN_GROUPS = FILTER_GROUPS.reduce((groups, group, index) => {
  groups[group.id] = index === 0;
  return groups;
}, {});

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSearchableProductText(product) {
  return normalize([
    product.name,
    product.category,
    product.collection,
    product.subcollection,
    product.filters?.color,
    product.filters?.categoria,
    ...(product.tags || []),
  ].join(" "));
}

function productMatchesOption(product, groupId, option) {
  const productText = getSearchableProductText(product);
  const matchesAlias = option.aliases.some((alias) => productText.includes(normalize(alias)));

  if (groupId === "italianas") {
    return normalize(product.collection) === "italianas" && matchesAlias;
  }

  return matchesAlias;
}

export default function ProductCatalog({ products }) {
  const [openGroups, setOpenGroups] = useState(INITIAL_OPEN_GROUPS);
  const [activeFilters, setActiveFilters] = useState({
    materials: [],
    italianas: [],
    accessories: [],
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = Object.values(activeFilters).reduce(
    (total, filters) => total + filters.length,
    0,
  );

  const activeBadges = FILTER_GROUPS.flatMap((group) =>
    activeFilters[group.id].map((optionId) => {
      const option = group.options.find((item) => item.id === optionId);
      return option ? { groupId: group.id, optionId, label: option.label } : null;
    }).filter(Boolean),
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return FILTER_GROUPS.every((group) => {
        const selectedOptions = activeFilters[group.id];

        if (!selectedOptions.length) {
          return true;
        }

        return selectedOptions.some((optionId) => {
          const option = group.options.find((item) => item.id === optionId);
          return option ? productMatchesOption(product, group.id, option) : true;
        });
      });
    });
  }, [activeFilters, products]);

  const toggleGroup = (groupId) => {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  const toggleFilter = (groupId, optionId) => {
    setActiveFilters((current) => {
      const groupFilters = current[groupId];
      const isActive = groupFilters.includes(optionId);

      return {
        ...current,
        [groupId]: isActive ? [] : [optionId],
      };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      materials: [],
      italianas: [],
      accessories: [],
    });
  };

  return (
    <div className="products-catalog-layout mt-4">
      <aside className="products-filter-sidebar" aria-label="Filtros de productos">
        <button
          className="products-filter-mobile-toggle"
          type="button"
          onClick={() => setMobileOpen((isOpen) => !isOpen)}
          aria-expanded={mobileOpen}
        >
          <span>
            <SlidersHorizontal size={18} />
            Filtros
          </span>
          <ChevronDown
            size={18}
            className={mobileOpen ? "products-filter-chevron is-open" : "products-filter-chevron"}
          />
        </button>

        {activeBadges.length > 0 && (
          <div className="products-filter-active-chips" aria-label="Filtros activos">
            {activeBadges.map((badge) => (
              <button
                className="products-filter-chip"
                key={`${badge.groupId}-${badge.optionId}`}
                type="button"
                onClick={() => toggleFilter(badge.groupId, badge.optionId)}
              >
                {badge.label}
                <X size={14} />
              </button>
            ))}
          </div>
        )}

        <div className={mobileOpen ? "products-filter-panel is-open" : "products-filter-panel"}>
          <div className="products-filter-head">
            <div>
              <span className="mini-label">Catalogo</span>
              <h2>Filtrar por</h2>
            </div>
            {activeCount > 0 && (
              <button className="products-filter-clear" type="button" onClick={clearFilters}>
                <X size={16} />
                Limpiar
              </button>
            )}
          </div>

          <div className="products-filter-groups">
            {FILTER_GROUPS.map((group) => {
              const Icon = group.icon;
              const isOpen = openGroups[group.id];

              return (
                <section className="products-filter-group" key={group.id}>
                  <button
                    className="products-filter-group-toggle"
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <Icon size={18} />
                      {group.title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={isOpen ? "products-filter-chevron is-open" : "products-filter-chevron"}
                    />
                  </button>

                  {isOpen && (
                    <div className="products-filter-options">
                      {group.options.map((option) => {
                        const isActive = activeFilters[group.id].includes(option.id);

                        return (
                          <button
                            className={isActive ? "products-filter-option is-active" : "products-filter-option"}
                            key={option.id}
                            type="button"
                            onClick={() => toggleFilter(group.id, option.id)}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="products-results" aria-live="polite">
        <div className="products-results-head">
          <span className="filter-count">
            {filteredProducts.length} de {products.length} productos
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-xl-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-empty-state">
            <h3>No hay productos con estos filtros</h3>
            <p>Proba con otra combinacion o limpia los filtros activos.</p>
            <button className="btn-mali btn-outline-mali" type="button" onClick={clearFilters}>
              Ver todos los productos
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
