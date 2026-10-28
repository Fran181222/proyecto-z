import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/app/lib/supabase-public";
import { products as staticProducts, sets as staticSets } from "@/data/products";

/**
 * Capa de acceso al catálogo (solo servidor).
 * Combina lo que carga el admin en Supabase con el catálogo estático de data/products.js,
 * que queda como respaldo: si la base falla o está vacía, la tienda sigue funcionando.
 * Si un id existe en los dos lados, gana el de la base.
 */

function productFromRow(row) {
  const filters = Array.isArray(row.filters) ? row.filters : [];
  const sizes = row.price_by_size && Object.keys(row.price_by_size).length ? row.price_by_size : null;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    collection: row.collection || "accesorios",
    subcollection: row.subcollection || row.category,
    plan: row.plan || "",
    price: Number(row.price),
    pricesBySize: sizes,
    stock: row.stock ?? 0,
    images: (row.images || []).map((src, index) => ({
      src,
      alt: index === 0 ? row.name : `${row.name} - vista ${index + 1}`,
    })),
    desc: row.description || "",
    tags: [...(row.tags || []), ...filters.map((f) => f.toLowerCase())],
    filters,
    reviews: [],
    relatedIds: [],
  };
}

const fetchDbProducts = cache(async () => {
  try {
    const { data, error } = await createPublicClient()
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(productFromRow).filter((p) => p.images.length > 0);
  } catch {
    return [];
  }
});

export const getProducts = cache(async () => {
  const dbProducts = await fetchDbProducts();
  const dbIds = new Set(dbProducts.map((p) => p.id));
  return [...dbProducts, ...staticProducts.filter((p) => !dbIds.has(p.id))];
});

export async function getProductById(id) {
  const all = await getProducts();
  return all.find((p) => p.id === id) || null;
}

export async function getRelatedProducts(product) {
  const all = await getProducts();

  if (product.relatedIds?.length) {
    return product.relatedIds.map((id) => all.find((p) => p.id === id)).filter(Boolean);
  }
  return all.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
}

const fetchDbSets = cache(async () => {
  try {
    const { data, error } = await createPublicClient()
      .from("sets")
      .select("*, set_products(position, product_id)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];

    return data
      .filter((row) => row.image)
      .map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || "",
        image: row.image,
        imageDetail: row.image_detail || row.image,
        accent: row.accent || "rose",
        productIds: [...(row.set_products || [])]
          .sort((a, b) => a.position - b.position)
          .map((item) => item.product_id),
      }));
  } catch {
    return [];
  }
});

export const getSets = cache(async () => {
  const dbSets = await fetchDbSets();
  const dbIds = new Set(dbSets.map((s) => s.id));
  const fallback = staticSets
    .filter((s) => !dbIds.has(s.id))
    .map((s) => ({ ...s, imageDetail: s.image }));
  return [...dbSets, ...fallback];
});

export async function getSetById(id) {
  const [allSets, allProducts] = await Promise.all([getSets(), getProducts()]);
  const set = allSets.find((item) => item.id === id);
  if (!set) return null;

  return {
    ...set,
    products: set.productIds.map((pid) => allProducts.find((p) => p.id === pid)).filter(Boolean),
  };
}
