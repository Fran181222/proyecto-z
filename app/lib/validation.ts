/**
 * Reglas de validación del catálogo.
 * Se usan en el navegador (feedback inmediato) y en el servidor (validación real):
 * nunca confiar solo en la del navegador.
 */

export const CATEGORIES = ['Anillos', 'Collares', 'Aros', 'Pulseras', 'Bufandones', 'Charms', 'Herramientas', 'Cadenas'] as const
export const COLLECTIONS = [
  { id: 'accesorios', label: 'Accesorios' },
  { id: 'italianas', label: 'Italianas' },
  { id: 'materiales', label: 'Materiales' },
] as const
export const MATERIALS = ['Oro', 'Plata', 'Rose gold'] as const
export const SET_ACCENTS = [
  { id: 'rose', label: 'Rosa' },
  { id: 'wine', label: 'Vino' },
  { id: 'pine', label: 'Verde pino' },
  { id: 'pink', label: 'Rosa claro' },
] as const

export const STORAGE_BUCKET = 'catalog'
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const
export const IMAGE_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_PRODUCT_IMAGES = 8
export const MAX_SET_PRODUCTS = 12
export const MIN_SET_PRODUCTS = 2

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Valida un archivo antes de subirlo. Devuelve el mensaje de error o null. */
export function validateImageFile(file: { type: string; size: number; name: string }) {
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return `"${file.name}": formato no permitido (usá JPG, PNG, WebP o AVIF).`
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}": pesa más de ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`
  }
  if (file.size === 0) return `"${file.name}": el archivo está vacío.`
  return null
}

/** Solo se aceptan URLs de NUESTRO bucket y dentro de la carpeta esperada. */
function isOwnImageUrl(url: unknown, folder: 'products' | 'sets') {
  if (typeof url !== 'string') return false
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${folder}/`
  if (!url.startsWith(base)) return false
  return /^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(url.slice(base.length))
}

export type FieldErrors = Record<string, string>
// Sin strictNullChecks TypeScript no estrecha uniones por `ok`, por eso ambos lados declaran todos los campos.
export type Validated<T> =
  | { ok: true; data: T; errors?: undefined }
  | { ok: false; errors: FieldErrors; data?: undefined }

const asString = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const asStringList = (v: unknown) => (Array.isArray(v) ? v.map(asString).filter(Boolean) : [])

export type ProductInput = {
  id: string
  name: string
  category: string
  collection: string
  price: number
  stock: number
  description: string
  materials: string[]
  tags: string[]
  priceBySize: Record<string, number>
  images: string[]
  isActive: boolean
}

/** "12=2400, 14=2600" -> { "12": 2400, "14": 2600 } */
export function parsePriceBySize(raw: string): { value: Record<string, number>; error?: string } {
  const value: Record<string, number> = {}
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length > 12) return { value, error: 'Máximo 12 talles.' }
  for (const part of parts) {
    const match = part.match(/^([^=\s]{1,10})\s*=\s*(\d+(?:\.\d{1,2})?)$/)
    if (!match) return { value, error: `Formato inválido en "${part}". Usá talle=precio, ej: 12=2400, 14=2600.` }
    const price = Number(match[2])
    if (price <= 0 || price > 100_000_000) return { value, error: `Precio fuera de rango en "${part}".` }
    value[match[1]] = price
  }
  return { value }
}

export function validateProduct(raw: unknown): Validated<ProductInput> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const errors: FieldErrors = {}

  const name = asString(input.name)
  if (name.length < 2 || name.length > 120) errors.name = 'El nombre debe tener entre 2 y 120 caracteres.'

  const id = asString(input.id)
  if (id.length < 3 || id.length > 80 || !SLUG_RE.test(id)) {
    errors.id = 'El ID debe tener 3–80 caracteres: minúsculas, números y guiones (ej: anillo-coral-glow).'
  }

  const category = asString(input.category)
  if (!(CATEGORIES as readonly string[]).includes(category)) errors.category = 'Elegí una categoría válida.'

  const collection = asString(input.collection)
  if (!COLLECTIONS.some((c) => c.id === collection)) errors.collection = 'Elegí una colección válida.'

  const price = Number(input.price)
  if (!Number.isFinite(price) || price <= 0 || price > 100_000_000) {
    errors.price = 'El precio debe ser un número mayor a 0.'
  } else if (!/^\d+(\.\d{1,2})?$/.test(String(input.price).trim())) {
    errors.price = 'El precio admite hasta 2 decimales.'
  }

  const stock = Number(input.stock)
  if (!Number.isInteger(stock) || stock < 0 || stock > 100_000) {
    errors.stock = 'El stock debe ser un entero entre 0 y 100000.'
  }

  const description = asString(input.description)
  if (description.length < 10 || description.length > 2000) {
    errors.description = 'La descripción debe tener entre 10 y 2000 caracteres.'
  }

  const materials = asStringList(input.materials)
  if (materials.some((m) => !(MATERIALS as readonly string[]).includes(m))) errors.materials = 'Material inválido.'

  const tags = [...new Set(asStringList(input.tags).map((t) => t.toLowerCase()))]
  if (tags.length > 10 || tags.some((t) => t.length > 30)) {
    errors.tags = 'Máximo 10 tags de hasta 30 caracteres.'
  }

  const sizes = parsePriceBySize(asString(input.priceBySizeRaw))
  const priceBySize = sizes.value
  if (sizes.error) errors.priceBySize = sizes.error

  const images = asStringList(input.images)
  if (images.length < 1) errors.images = 'Subí al menos una imagen.'
  else if (images.length > MAX_PRODUCT_IMAGES) errors.images = `Máximo ${MAX_PRODUCT_IMAGES} imágenes.`
  else if (!images.every((u) => isOwnImageUrl(u, 'products'))) errors.images = 'Alguna imagen no es válida. Volvé a subirla.'

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      id, name, category, collection, price, stock, description, materials, tags, priceBySize, images,
      isActive: input.isActive !== false,
    },
  }
}

export type SetInput = {
  id: string
  title: string
  subtitle: string
  accent: string
  image: string
  imageDetail: string
  productIds: string[]
  isActive: boolean
}

export function validateSet(raw: unknown): Validated<SetInput> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const errors: FieldErrors = {}

  const title = asString(input.title)
  if (title.length < 2 || title.length > 80) errors.title = 'El título debe tener entre 2 y 80 caracteres.'

  const id = asString(input.id)
  if (id.length < 3 || id.length > 80 || !SLUG_RE.test(id)) {
    errors.id = 'El ID debe tener 3–80 caracteres: minúsculas, números y guiones.'
  }

  const subtitle = asString(input.subtitle)
  if (subtitle.length < 5 || subtitle.length > 160) errors.subtitle = 'El subtítulo debe tener entre 5 y 160 caracteres.'

  const accent = asString(input.accent)
  if (!SET_ACCENTS.some((a) => a.id === accent)) errors.accent = 'Elegí un color válido.'

  const image = asString(input.image)
  if (!isOwnImageUrl(image, 'sets')) errors.image = 'Subí la imagen de portada.'
  const imageDetail = asString(input.imageDetail)
  if (!isOwnImageUrl(imageDetail, 'sets')) errors.imageDetail = 'Subí la imagen de detalle.'

  const productIds = [...new Set(asStringList(input.productIds))]
  if (productIds.length < MIN_SET_PRODUCTS || productIds.length > MAX_SET_PRODUCTS) {
    errors.productIds = `Elegí entre ${MIN_SET_PRODUCTS} y ${MAX_SET_PRODUCTS} productos.`
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, data: { id, title, subtitle, accent, image, imageDetail, productIds, isActive: input.isActive !== false } }
}
