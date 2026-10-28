import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabase } from './supabase-server'

/**
 * Autorización real del panel. Se hace en el servidor, contra Supabase Auth (getUser valida
 * el token con el servidor de Auth, no confía en la cookie) y contra la tabla `admins`.
 * Devuelve null si no hay sesión o el usuario no es admin.
 */
export const getAdminContext = cache(async () => {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin')
  if (rpcError || isAdmin !== true) return null

  return { supabase, user: data.user }
})

/** Para páginas/layouts: redirige al login si no es admin. */
export async function requireAdmin() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/admin/login')
  return ctx
}
