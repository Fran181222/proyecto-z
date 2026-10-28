import type { Metadata } from 'next'
import { requireAdmin } from '@/app/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Panel de administración',
  robots: { index: false, follow: false },
}

// Segunda barrera: aunque alguien salte el proxy, nada del panel se renderiza sin ser admin.
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return children
}
