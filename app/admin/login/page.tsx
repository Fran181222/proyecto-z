import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminContext } from '@/app/lib/admin-auth'
import LoginForm from './LoginForm'
import s from '../admin.module.css'

export const metadata: Metadata = {
  title: 'Acceso administración',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  if (await getAdminContext()) redirect('/admin')

  return (
    <main className={s.shell}>
      <div className="container">
        <div className={s.loginCard}>
          <p className="section-tag mb-3">Malibu · Administración</p>
          <h1 className={s.loginTitle}>Iniciar sesión</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
