'use server'

import { revalidatePath } from 'next/cache'
import { getAdminContext } from '@/app/lib/admin-auth'
import { validateProduct, validateSet, type FieldErrors } from '@/app/lib/validation'

export type ActionResult = { ok: boolean; error?: string; errors?: FieldErrors }

const UNAUTHORIZED: ActionResult = { ok: false, error: 'Sesión vencida o sin permisos. Volvé a ingresar.' }

// Tienda pública: se invalida todo para que el producto/set aparezca de inmediato.
function refreshStore() {
  revalidatePath('/', 'layout')
}

/** Cada acción vuelve a verificar que quien llama es admin: las Server Actions son endpoints públicos. */
export async function createProductAction(raw: unknown): Promise<ActionResult> {
  const ctx = await getAdminContext()
  if (!ctx) return UNAUTHORIZED

  const parsed = validateProduct(raw)
  if (!parsed.ok) return { ok: false, errors: parsed.errors }
  const p = parsed.data

  const { error } = await ctx.supabase.from('products').insert({
    id: p.id,
    name: p.name,
    category: p.category,
    subcollection: p.category,
    collection: p.collection,
    price: p.price,
    stock: p.stock,
    description: p.description,
    price_by_size: p.priceBySize,
    images: p.images,
    filters: p.materials,
    tags: p.tags,
    is_active: p.isActive,
  })

  if (error) {
    if (error.code === '23505') return { ok: false, errors: { id: 'Ya existe un producto con ese ID.' } }
    return { ok: false, error: 'No se pudo guardar el producto. Revisá los datos e intentá de nuevo.' }
  }

  refreshStore()
  return { ok: true }
}

export async function setProductActiveAction(id: string, active: boolean): Promise<ActionResult> {
  const ctx = await getAdminContext()
  if (!ctx) return UNAUTHORIZED
  if (typeof id !== 'string' || !id || typeof active !== 'boolean') return { ok: false, error: 'Datos inválidos.' }

  const { error } = await ctx.supabase.from('products').update({ is_active: active }).eq('id', id)
  if (error) return { ok: false, error: 'No se pudo actualizar el producto.' }

  refreshStore()
  return { ok: true }
}

export async function createSetAction(raw: unknown): Promise<ActionResult> {
  const ctx = await getAdminContext()
  if (!ctx) return UNAUTHORIZED

  const parsed = validateSet(raw)
  if (!parsed.ok) return { ok: false, errors: parsed.errors }
  const set = parsed.data

  // Los productos del set tienen que existir de verdad.
  const { data: existing, error: lookupError } = await ctx.supabase
    .from('products')
    .select('id')
    .in('id', set.productIds)
  if (lookupError) return { ok: false, error: 'No se pudieron verificar los productos.' }
  if ((existing?.length ?? 0) !== set.productIds.length) {
    return { ok: false, errors: { productIds: 'Alguno de los productos elegidos ya no existe.' } }
  }

  const { error: setError } = await ctx.supabase.from('sets').insert({
    id: set.id,
    title: set.title,
    subtitle: set.subtitle,
    accent: set.accent,
    image: set.image,
    image_detail: set.imageDetail,
    is_active: set.isActive,
  })
  if (setError) {
    if (setError.code === '23505') return { ok: false, errors: { id: 'Ya existe un set con ese ID.' } }
    return { ok: false, error: 'No se pudo guardar el set.' }
  }

  const { error: linkError } = await ctx.supabase.from('set_products').insert(
    set.productIds.map((productId, position) => ({ set_id: set.id, product_id: productId, position })),
  )
  if (linkError) {
    // Sin productos el set queda a medias: lo deshacemos.
    await ctx.supabase.from('sets').delete().eq('id', set.id)
    return { ok: false, error: 'No se pudieron asignar los productos al set.' }
  }

  refreshStore()
  return { ok: true }
}

export async function setSetActiveAction(id: string, active: boolean): Promise<ActionResult> {
  const ctx = await getAdminContext()
  if (!ctx) return UNAUTHORIZED
  if (typeof id !== 'string' || !id || typeof active !== 'boolean') return { ok: false, error: 'Datos inválidos.' }

  const { error } = await ctx.supabase.from('sets').update({ is_active: active }).eq('id', id)
  if (error) return { ok: false, error: 'No se pudo actualizar el set.' }

  refreshStore()
  return { ok: true }
}
