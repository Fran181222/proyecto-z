import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  price_by_size: Record<string, number>
  images: string[]
  filters: string[]
  tags: string[]
  description: string
  stock: number
  collection: string
  subcollection: string | null
  plan: string | null
  is_active: boolean
  created_at: string
}

export type Review = {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type WishlistItem = {
  user_id: string
  product_id: string
  added_at: string
  products?: Product
}

export type UserProfile = {
  id: string
  email: string
  name: string
  surname: string
  phone: string | null
  created_at: string
}

export type SetRow = {
  id: string
  title: string
  subtitle: string | null
  image: string | null
  image_detail: string | null
  accent: string
  is_active: boolean
  created_at: string
  set_products: { position: number; products: Product }[]
}
