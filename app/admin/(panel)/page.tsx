'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient, Product, Review, SetRow, UserProfile, WishlistItem } from '@/app/lib/supabase'
import ProductForm from '@/components/admin/ProductForm'
import SetForm from '@/components/admin/SetForm'
import { logoutAction } from '../login/actions'
import { setProductActiveAction, setSetActiveAction } from './actions'
import s from '../admin.module.css'

type Tab = 'overview' | 'products' | 'sets' | 'reviews' | 'wishlist' | 'usuarios'
type Status = 'pending' | 'ok' | 'error'

const TABS: [Tab, string][] = [
  ['overview', 'Resumen'],
  ['products', 'Productos'],
  ['sets', 'Colecciones'],
  ['reviews', 'Reseñas'],
  ['wishlist', 'Wishlist'],
  ['usuarios', 'Usuarios'],
]

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

function Stars({ rating }: { rating: number }) {
  return (
    <span className={s.stars} aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? undefined : s.starsOff}>★</span>
      ))}
    </span>
  )
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <span className={`${s.thumb} ${s.thumbEmpty}`} />
  return <img src={src} alt={alt} className={s.thumb} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
}

function Tags({ items, gray }: { items: string[]; gray?: boolean }) {
  if (!items?.length) return <span className={s.dim}>—</span>
  return (
    <div className={s.tags}>
      {items.map((t) => <span key={t} className={`${s.badge} ${gray ? s.badgeGray : ''}`}>{t}</span>)}
    </div>
  )
}

function UserCell({ userId, users }: { userId: string; users: UserProfile[] }) {
  const u = users.find((user) => user.id === userId)
  if (!u) return <span className={s.mono}>{userId.slice(0, 8)}…</span>
  return (
    <div>
      <div>{u.name} {u.surname}</div>
      <div className={`${s.dim} ${s.small}`}>{u.email}</div>
    </div>
  )
}

function Empty({ children }: { children: string }) {
  return <div className={s.empty}>{children}</div>
}

function ReviewsTable({ reviews, users }: { reviews: Review[]; users: UserProfile[] }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead><tr><th>Producto</th><th>Usuario</th><th>Rating</th><th>Comentario</th><th>Fecha</th></tr></thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td><span className={s.badge}>{r.product_id}</span></td>
              <td><UserCell userId={r.user_id} users={users} /></td>
              <td><Stars rating={r.rating} /></td>
              <td className={s.comment}>{r.comment || <span className={s.dim}>—</span>}</td>
              <td className={`${s.dim} ${s.small}`}>{formatDate(r.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Overview({ products, sets, reviews, users }: { products: Product[]; sets: SetRow[]; reviews: Review[]; users: UserProfile[] }) {
  const active = products.filter((p) => p.is_active).length
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const byCategory = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1])

  return (
    <>
      <div className={s.stats}>
        <div className={s.stat}>
          <div className={s.statLabel}>Productos</div>
          <div className={s.statValue}>{products.length}</div>
          <div className={s.statSub}>{active} activos · {products.length - active} inactivos</div>
        </div>
        <div className={s.stat}>
          <div className={s.statLabel}>Colecciones</div>
          <div className={s.statValue}>{sets.length}</div>
          <div className={s.statSub}>{sets.reduce((sum, c) => sum + c.set_products.length, 0)} asignados</div>
        </div>
        <div className={s.stat}>
          <div className={s.statLabel}>Usuarios</div>
          <div className={s.statValue}>{users.length}</div>
        </div>
        <div className={s.stat}>
          <div className={s.statLabel}>Reseñas</div>
          <div className={s.statValue}>{reviews.length}</div>
          <div className={s.statSub}>Promedio {avgRating} ★</div>
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Productos por categoría</h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Categoría</th><th>Cantidad</th><th>%</th></tr></thead>
            <tbody>
              {byCategory.map(([cat, count]) => {
                const pct = Math.round((count / products.length) * 100)
                return (
                  <tr key={cat}>
                    <td><span className={s.badge}>{cat}</span></td>
                    <td>{count}</td>
                    <td>
                      <div className={s.bar}>
                        <div className={s.barTrack}><div className={s.barFill} style={{ width: `${pct}%` }} /></div>
                        <span className={`${s.dim} ${s.small}`}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Últimas reseñas</h2>
        {reviews.length ? <ReviewsTable reviews={reviews.slice(0, 5)} users={users} /> : <Empty>No hay reseñas aún.</Empty>}
      </div>
    </>
  )
}

function ProductsView({ products, onRefresh, onError }: { products: Product[]; onRefresh: () => void; onError: (msg: string) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  const query = search.toLowerCase()
  const filtered = products
    .filter((p) => filter === 'all' || p.is_active === (filter === 'active'))
    .filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))

  async function toggleActive(product: Product) {
    const result = await setProductActiveAction(product.id, !product.is_active)
    if (!result.ok) onError(result.error ?? 'No se pudo actualizar el producto.')
    else onRefresh()
  }

  return (
    <>
      <div className={s.toolbar}>
        <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowModal(true)}>+ Nuevo producto</button>
      </div>

      {filtered.length ? (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Foto</th><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Filtros</th><th>Tags</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><Thumb src={p.images?.[0]} alt={p.name} /></td>
                  <td className={s.mono}>{p.id}</td>
                  <td>{p.name}</td>
                  <td><span className={s.badge}>{p.category}</span></td>
                  <td className={s.price}>{formatPrice(p.price)}</td>
                  <td><Tags items={p.filters} /></td>
                  <td><Tags items={p.tags} gray /></td>
                  <td><span className={`${s.badge} ${p.is_active ? s.badgeOk : s.badgeOff}`}>{p.is_active ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <button className={`${s.btn} ${s.btnSm} ${p.is_active ? s.btnDanger : s.btnOutline}`} onClick={() => toggleActive(p)}>
                      {p.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Empty>No se encontraron productos.</Empty>}

      {showModal && <ProductForm onClose={() => setShowModal(false)} onSaved={onRefresh} />}
    </>
  )
}

function SetsView({ sets, products, onRefresh, onError }: { sets: SetRow[]; products: Product[]; onRefresh: () => void; onError: (msg: string) => void }) {
  const [showModal, setShowModal] = useState(false)

  async function toggleActive(set: SetRow) {
    const result = await setSetActiveAction(set.id, !set.is_active)
    if (!result.ok) onError(result.error ?? 'No se pudo actualizar el set.')
    else onRefresh()
  }

  return (
    <>
      <div className={s.toolbar} style={{ justifyContent: 'flex-end' }}>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowModal(true)}>+ Nuevo set</button>
      </div>
      {sets.length ? (
    <div className={s.list}>
      {sets.map((set) => (
        <div key={set.id} className={s.card}>
          <div className={s.setHead}>
            {set.image && <img src={set.image} alt={set.title} className={s.setImg} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />}
            {set.image_detail && <img src={set.image_detail} alt={`${set.title} detalle`} className={s.setImg} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />}
            <div style={{ flex: 1 }}>
              <h3 className={s.setTitle}>{set.title}</h3>
              <div className={`${s.dim} ${s.small}`}>{set.subtitle ? `${set.subtitle} · ` : ''}<span className={s.mono}>{set.id}</span></div>
            </div>
            <span className={`${s.badge} ${set.is_active ? s.badgeOk : s.badgeOff}`}>{set.is_active ? 'Activo' : 'Inactivo'}</span>
            <button className={`${s.btn} ${s.btnSm} ${set.is_active ? s.btnDanger : s.btnOutline}`} onClick={() => toggleActive(set)}>
              {set.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
          <div className={s.chips}>
            {[...set.set_products].sort((a, b) => a.position - b.position).map(({ products: p }) => (
              <div key={p.id} className={s.chip}>
                <Thumb src={p.images?.[0]} alt={p.name} />
                <div>
                  <div className={s.chipName}>{p.name}</div>
                  <div className={`${s.dim} ${s.small}`}>{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
      ) : <Empty>No hay colecciones.</Empty>}
      {showModal && <SetForm products={products} onClose={() => setShowModal(false)} onSaved={onRefresh} />}
    </>
  )
}

function WishlistView({ wishlist, users }: { wishlist: WishlistItem[]; users: UserProfile[] }) {
  if (!wishlist.length) return <Empty>No hay favoritos aún.</Empty>
  const grouped = wishlist.reduce<Record<string, WishlistItem[]>>((acc, w) => {
    (acc[w.user_id] ||= []).push(w)
    return acc
  }, {})
  return (
    <div className={s.list}>
      {Object.entries(grouped).map(([userId, items]) => {
        const u = users.find((user) => user.id === userId)
        return (
          <div key={userId} className={s.card}>
            <div style={{ marginBottom: '0.9rem' }}>
              <div>{u ? `${u.name} ${u.surname}` : 'Usuario desconocido'}</div>
              <div className={`${s.dim} ${s.small}`}>{u?.email} · {items.length} guardado{items.length !== 1 ? 's' : ''}</div>
            </div>
            <div className={s.chips}>
              {items.map((w) => (
                <div key={w.product_id} className={s.chip}>
                  <Thumb src={w.products?.images?.[0]} alt={w.products?.name || ''} />
                  <div>
                    <div className={s.chipName}>{w.products?.name}</div>
                    {w.products && <div className={`${s.dim} ${s.small}`}>{formatPrice(w.products.price)}</div>}
                  </div>
                  <span className={s.heart}>♥</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function UsuariosView({ users }: { users: UserProfile[] }) {
  if (!users.length) return <Empty>No hay usuarios registrados aún.</Empty>
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Registrado</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name} {u.surname}</td>
              <td className={s.dim}>{u.email}</td>
              <td className={s.dim}>{u.phone || '—'}</td>
              <td className={`${s.dim} ${s.small}`}>{formatDate(u.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [sets, setSets] = useState<SetRow[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Status>('pending')
  const [error, setError] = useState('')

  const fetchAll = useCallback(async () => {
    setError('')
    try {
      const supabase = createClient()
      const [p, st, r, w, u] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('sets').select('*, set_products(position, products(*))').order('created_at', { ascending: false }),
        supabase.from('product_reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('user_wishlist').select('*, products(*)').order('added_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
      ])
      const failed = [p, st, r, w, u].find((res) => res.error)
      if (failed?.error) {
        setError(failed.error.message)
        setStatus('error')
      } else {
        setProducts(p.data || [])
        setSets((st.data || []) as SetRow[])
        setReviews(r.data || [])
        setWishlist((w.data || []) as WishlistItem[])
        setUsers(u.data || [])
        setStatus('ok')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
      setStatus('error')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <main className={s.shell}>
      <div className="container">
        <div className={s.header}>
          <h1 className="section-title mb-0">Panel de administración</h1>
          <div className={s.status}>
            <span className={`${s.dot} ${status === 'ok' ? s.dotOk : status === 'error' ? s.dotErr : ''}`} />
            {status === 'ok' ? 'Conectado' : status === 'error' ? 'Sin conexión' : 'Conectando…'}
            <button className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} onClick={fetchAll}>Recargar</button>
            <form action={logoutAction}>
              <button className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} type="submit">Cerrar sesión</button>
            </form>
          </div>
        </div>

        <div className={s.tabs} role="tablist">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              className={`${s.tab} ${tab === key ? s.tabActive : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
              {key === 'usuarios' && users.length > 0 && <span className={s.count}>{users.length}</span>}
            </button>
          ))}
        </div>

        {error && <div className={s.error}>{error}</div>}

        {loading ? <div className={s.loading}>Cargando…</div> : (
          <>
            {tab === 'overview' && <Overview products={products} sets={sets} reviews={reviews} users={users} />}
            {tab === 'products' && <ProductsView products={products} onRefresh={fetchAll} onError={setError} />}
            {tab === 'sets' && <SetsView sets={sets} products={products} onRefresh={fetchAll} onError={setError} />}
            {tab === 'reviews' && (reviews.length ? <ReviewsTable reviews={reviews} users={users} /> : <Empty>No hay reseñas aún.</Empty>)}
            {tab === 'wishlist' && <WishlistView wishlist={wishlist} users={users} />}
            {tab === 'usuarios' && <UsuariosView users={users} />}
          </>
        )}
      </div>
    </main>
  )
}
