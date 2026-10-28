import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Primera barrera del panel de administración (chequeo optimista, sin consultar la base).
 * - Refresca la sesión de Supabase en cada request a /admin.
 * - Sin sesión => redirige a /admin/login.
 * - Agrega cabeceras para que el panel no se indexe, no se cachee ni se embeba en iframes.
 * La autorización real (¿es admin?) se hace en el servidor: app/lib/admin-auth.ts + RLS.
 */
function hardened(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!data?.claims && !isLoginPage) {
    const redirect = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return hardened(redirect)
  }

  return hardened(response)
}

export const config = {
  matcher: ['/admin/:path*'],
}
