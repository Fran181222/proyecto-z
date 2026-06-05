export const products = [
  {
    id: "aros-corazon-celeste",
    name: "Aros Corazón Celeste",
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
    desc: "Aros con forma de corazón en tono celeste, ideales para uso diario.",
    tags: ["dorado", "aros"],
    filters: { color: "Dorado", categoria: "Para compartir" },
    reviews: [
      { id: 1, name: "Laura M.", rating: 5, comment: "Hermosos, llegaron perfectos!", date: "2025-05-10" },
      { id: 2, name: "Sofía R.", rating: 4, comment: "Muy buena calidad, los uso todos los días.", date: "2025-04-28" },
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
    desc: "Capas finas con caída fluida y detalles pulidos.",
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
    desc: "Volumen escultórico con piedra coral protagonista.",
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
      { src: "/img/display-shiny-luxurious-golden-chain.jpg", alt: "Cadena Pacific Glow" },
    ],
    desc: "Diseño versátil para layering sofisticado con textura de alto brillo.",
    tags: ["dorado", "collares"],
    filters: { color: "Dorado", categoria: "Para compartir" },
    reviews: [],
    relatedIds: ["collar-sunset-layers", "pulsera-coastline"],
  },
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

export const sets = [
  {
    id: "costa-dorada",
    title: "Costa Dorada",
    subtitle: "Brillo editorial para un look de dia y noche.",
    image: "/img/display-shiny-luxurious-golden-chain.jpg",
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
    image: "/img/expensive-golden-ring-displayed-white-coral-background.jpg",
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
    image: "/img/display-shiny-elegant-gold-chain.jpg",
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
    image: "/img/vista-arriba-cadenas-oro-naturaleza-muerta_23-2149560671.avif",
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
