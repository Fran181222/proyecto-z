'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/app/lib/supabase-server'

export type LoginState = { error?: string }

// Límite de intentos en memoria (mejor esfuerzo: en serverless cada instancia tiene el suyo).
// Supabase Auth aplica además sus propios límites por IP/usuario.
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_EMAIL = 5
const MAX_PER_IP = 20
const attempts = new Map<string, { count: number; start: number }>()

function hit(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now - entry.start > WINDOW_MS) attempts.set(key, { count: 1, start: now })
  else entry.count += 1
}

function blocked(key: string, max: number) {
  const entry = attempts.get(key)
  if (!entry) return false
  if (Date.now() - entry.start > WINDOW_MS) {
    attempts.delete(key)
    return false
  }
  return entry.count >= max
}

const GENERIC_ERROR = 'Credenciales inválidas.'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!EMAIL_RE.test(email) || email.length > 254 || password.length < 6 || password.length > 200) {
    return { error: GENERIC_ERROR }
  }

  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const emailKey = `e:${email}`
  const ipKey = `i:${ip}`

  if (blocked(emailKey, MAX_PER_EMAIL) || blocked(ipKey, MAX_PER_IP)) {
    return { error: 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.' }
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    hit(emailKey)
    hit(ipKey)
    return { error: GENERIC_ERROR }
  }

  // Tener cuenta no alcanza: tiene que estar en la tabla `admins`.
  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (isAdmin !== true) {
    await supabase.auth.signOut()
    hit(emailKey)
    hit(ipKey)
    // Mismo mensaje que una contraseña mala: no revela si la cuenta existe.
    return { error: GENERIC_ERROR }
  }

  attempts.delete(emailKey)
  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
