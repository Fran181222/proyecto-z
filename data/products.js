/**
 * Referencia temporal del catálogo de Malibu.
 *
 * Estructura de un producto válido:
 * - Obligatorios: `id`, `name`, `price`, `images`, `category`, `collection`, `subcollection`, `plan`, `stock`, `desc`, `tags`, `filters`, `reviews`, `relatedIds`.
 * - Opcionales: `pricesBySize`, `reviews`, `relatedIds`.
 * - `pricesBySize` es un objeto donde cada key representa una talla y cada value es el precio para esa talla.
 *
 * Este archivo todavía funciona como fuente de verdad temporal.
 * A futuro, estos datos vendrán desde una base de datos y las funciones de consulta se moverán a una capa de servicios.
 */
export const products = [
  {
    id: "aros-corazon-celeste",
    name: "Aros Corazon Celeste",
    category: "Aros",
    collection: "accesorios",
    subcollection: "Aros",
    plan: "Plan Oro",
    price: 2600,
    pricesBySize: {
      "12": 2400,
      "14": 2600,
      "16": 2900,
      "18": 3200,
    },
    stock: 8,
    images: [
      { src: "/img/aros-corazon-celeste.gif", alt: "Vista frontal" },
      { src: "/img/aros-corazon-celeste(2).jpg", alt: "Detalle lateral" },
      { src: "/img/aros-corazon-celeste(3).jpg", alt: "Detalle textura" },
    ],
    desc: "Aros con forma de corazÃ³n en tono celeste, ideales para uso diario.",
    tags: ["dorado", "aros"],
    filters: { color: "Dorado", categoria: "Para compartir" },
    reviews: [
      { id: 1, name: "Laura M.", rating: 5, comment: "Hermosos, llegaron perfectos!", date: "2025-05-10" },
      { id: 2, name: "SofÃ­a R.", rating: 4, comment: "Muy buena calidad, los uso todos los dÃ­as.", date: "2025-04-28" },
    ],
    relatedIds: ["collar-sunset-layers", "pulsera-coastline"],
  },
  {
    id: "collar-sunset-layers",
    name: "Collar Sunset Layers",
    category: "Collares",
    collection: "accesorios",
    subcollection: "Collares",
    plan: "Plan Oro",
    price: 84900,
    pricesBySize: null,
    stock: 5,
    images: [
      { src: "/img/display-shiny-elegant-gold-chain.jpg", alt: "Collar Sunset Layers" },
    ],
    desc: "Capas finas con caÃ­da fluida y detalles pulidos.",
    tags: ["dorado", "collares"],
    filters: { color: "Dorado", categoria: "Para compartir" },
    reviews: [],
    relatedIds: ["aros-corazon-celeste", "pulsera-coastline"],
  },
  {
    id: "anillo-coral-glow",
    name: "Anillo Coral Glow",
    category: "Anillos",
    collection: "accesorios",
    subcollection: "Anillos",
    plan: "Plan Oro",
    price: 61500,
    pricesBySize: {
      "14": 58000,
      "16": 61500,
      "18": 65000,
      "20": 68000,
    },
    stock: 3,
    images: [
      { src: "/img/expensive-golden-ring-displayed-white-coral-background.jpg", alt: "Anillo Coral Glow" },
    ],
    desc: "Volumen escultÃ³rico con piedra coral protagonista.",
    tags: ["dorado", "anillos"],
    filters: { color: "Dorado", categoria: "De viajes" },
    reviews: [],
    relatedIds: ["collar-sunset-layers"],
  },
  {
    id: "pulsera-coastline",
    name: "Pulsera Coastline Twist",
    category: "Pulseras",
    collection: "italianas",
    subcollection: "Pulseras",
    plan: "Plan Oro",
    price: 42700,
    pricesBySize: {
      "16": 40000,
      "18": 42700,
      "20": 45000,
      "22": 48000,
    },
    stock: 12,
    images: [
      { src: "/img/vista-arriba-cadenas-oro-naturaleza-muerta_23-2149560671.avif", alt: "Pulsera Coastline" },
    ],
    desc: "Textura premium para combinar con relojes y sets.",
    tags: ["dorado", "pulseras"],
    filters: { color: "Dorado", categoria: "De viajes" },
    reviews: [],
    relatedIds: ["collar-sunset-layers", "aros-corazon-celeste"],
  },
  {
    id: "cadena-pacific-glow",
    name: "Cadena Pacific Glow",
    category: "Collares",
    collection: "italianas",
    subcollection: "Collares",
    plan: "Plan Oro",
    price: 75000,
    pricesBySize: null,
    stock: 6,
    images: [
      { src: "/img/imagen-titulo.png", alt: "Imagen" },
    ],
    desc: "DiseÃ±o versÃ¡til para layering sofisticado con textura de alto brillo.",
    tags: ["dorado", "collares"],
    filters: { color: "Dorado", categoria: "Para compartir" },
    reviews: [],
    relatedIds: ["collar-sunset-layers", "pulsera-coastline"],
  },
];

/**
 * Filtra productos por colección.
 *
 * Patrón base para nuevos filtros:
 * export function getProductsByXXX(valueToFilter) {
 *   return products.filter((p) => p.fieldName === valueToFilter);
 * }
 *
 * Internamente usa `filter()` para recorrer `products` y quedarse solo con
 * los productos donde `p.collection === collectionId`.
 *
 * Si querés agregar otro filtro por collection, este es el lugar para hacerlo:
 * reemplazá o ampliá la condición dentro del `filter()` sin tocar el resto del archivo.
 *
 * Ejemplo de uso:
 * `const italianas = getProductsByCollection("italianas");`
 *
 * @param {string} collectionId - Identificador de la colección a buscar.
 * @returns {Array<Object>} Lista de productos que pertenecen a esa colección.
 */
export function getProductsByCollection(collectionId) {
  return products.filter((p) => p.collection === collectionId);
}

/**
 * Filtra productos por categoría.
 *
 * Patrón base para nuevos filtros:
 * export function getProductsByXXX(valueToFilter) {
 *   return products.filter((p) => p.fieldName === valueToFilter);
 * }
 *
 * Internamente usa `filter()` para recorrer `products` y quedarse solo con
 * los productos donde `p.category === category`.
 *
 * Si querés agregar un nuevo filtro por category o por otro campo, este es el lugar para hacerlo:
 * modificá la condición dentro del `filter()` o copiá este patrón para crear otra función.
 *
 * Ejemplo de uso:
 * `const collares = getProductsByCategory("Collares");`
 *
 * @param {string} category - Categoría a filtrar.
 * @returns {Array<Object>} Lista de productos que coinciden con la categoría indicada.
 */
export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}

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

export const sets = [
  {
    id: "costa-dorada",
    title: "Costa Dorada",
    subtitle: "Brillo editorial para un look de dia y noche.",
    image: "/img/pulsera-clapton-abeja.jpg",
    accent: "rose",
    productIds: [
      "cadena-pacific-glow",
      "collar-sunset-layers",
      "pulsera-coastline",
      "aros-corazon-celeste",
    ],
  },
  {
    id: "coral-glow",
    title: "Coral Glow",
    subtitle: "Anillos, collar y pulsera con presencia calida.",
    image: "/img/pulsera-clapton-abeja(1).jpg",
    accent: "wine",
    productIds: [
      "anillo-coral-glow",
      "collar-sunset-layers",
      "cadena-pacific-glow",
      "pulsera-coastline",
    ],
  },
  {
    id: "brisa-marina",
    title: "Brisa Marina",
    subtitle: "Capas suaves, textura limpia y acabado luminoso.",
    image: "/img/set2.png",
    accent: "pine",
    productIds: [
      "collar-sunset-layers",
      "aros-corazon-celeste",
      "pulsera-coastline",
    ],
  },
  {
    id: "ocean-spark",
    title: "Ocean Spark",
    subtitle: "Pulseras y cadenas para combinar todos los dias.",
    image: "/img/set2(1).png",
    accent: "pink",
    productIds: [
      "pulsera-coastline",
      "cadena-pacific-glow",
      "aros-corazon-celeste",
    ],
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getRelatedProducts(product) {
  if (!product?.relatedIds?.length) return [];
  return product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
}

export function getSetById(id) {
  const set = sets.find((item) => item.id === id);
  if (!set) return null;

  return {
    ...set,
    products: set.productIds
      .map((productId) => products.find((product) => product.id === productId))
      .filter(Boolean),
  };
}
