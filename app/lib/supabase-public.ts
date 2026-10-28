import { createClient } from '@supabase/supabase-js'

/**
 * Cliente anónimo para leer el catálogo desde el servidor (sin sesión, sin cookies).
 * Cada consulta se cachea 60 s en el Data Cache de Next; al guardar desde el admin se
 * invalida con revalidatePath, así que los cambios se ven al instante.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
      },
    },
  )
}
