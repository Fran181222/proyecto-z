'use client'

import { useState, useTransition } from 'react'
import { createSetAction } from '@/app/admin/(panel)/actions'
import type { Product } from '@/app/lib/supabase'
import {
  MAX_SET_PRODUCTS, MIN_SET_PRODUCTS, SET_ACCENTS, slugify, validateSet, type FieldErrors,
} from '@/app/lib/validation'
import ImageUploader, { removeUploadedImages } from './ImageUploader'
import s from '@/app/admin/admin.module.css'

type Props = { products: Product[]; onClose: () => void; onSaved: () => void }

export default function SetForm({ products, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [id, setId] = useState('')
  const [idTouched, setIdTouched] = useState(false)
  const [subtitle, setSubtitle] = useState('')
  const [accent, setAccent] = useState<string>(SET_ACCENTS[0].id)
  const [cover, setCover] = useState<string[]>([])
  const [detail, setDetail] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [pending, startTransition] = useTransition()

  const query = search.toLowerCase()
  const visible = products.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))

  function toggle(productId: string) {
    setSelected((prev) => {
      if (prev.includes(productId)) return prev.filter((x) => x !== productId)
      return prev.length >= MAX_SET_PRODUCTS ? prev : [...prev, productId]
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    const payload = {
      id, title, subtitle, accent, image: cover[0] ?? '', imageDetail: detail[0] ?? '',
      productIds: selected, isActive: true,
    }

    const local = validateSet(payload)
    if (!local.ok) {
      setErrors(local.errors)
      return
    }
    setErrors({})

    startTransition(async () => {
      const result = await createSetAction(payload)
      if (result.ok) {
        onSaved()
        onClose()
        return
      }
      if (result.errors) setErrors(result.errors)
      setFormError(result.error ?? 'Revisá los campos marcados.')
    })
  }

  async function handleCancel() {
    await removeUploadedImages([...cover, ...detail])
    onClose()
  }

  const invalid = (key: string) => (errors[key] ? s.inputInvalid : undefined)
  const err = (key: string) => errors[key] && <div className={s.fieldError} role="alert">{errors[key]}</div>

  return (
    <div className={s.overlay}>
      <form className={`${s.modal} ${s.modalWide}`} onSubmit={handleSubmit} noValidate>
        <h2>Nuevo set</h2>
        {formError && <div className={s.error} role="alert">{formError}</div>}

        <div className={s.row}>
          <div className={s.field}>
            <label htmlFor="s-title">Título</label>
            <input
              id="s-title" className={invalid('title')} maxLength={80} placeholder="Costa Dorada"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!idTouched) setId(slugify(e.target.value))
              }}
            />
            {err('title')}
          </div>
          <div className={s.field}>
            <label htmlFor="s-id">ID / URL</label>
            <input id="s-id" className={invalid('id')} maxLength={80} value={id} onChange={(e) => { setIdTouched(true); setId(slugify(e.target.value)) }} />
            {err('id') || <div className={s.hint}>Se usa en la URL: /sets/{id || 'id'}</div>}
          </div>
        </div>

        <div className={s.row}>
          <div className={s.field} style={{ flex: 2 }}>
            <label htmlFor="s-subtitle">Subtítulo</label>
            <input id="s-subtitle" className={invalid('subtitle')} maxLength={160} placeholder="Brillo editorial para un look de día y noche." value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            {err('subtitle')}
          </div>
          <div className={s.field}>
            <label htmlFor="s-accent">Color de acento</label>
            <select id="s-accent" value={accent} onChange={(e) => setAccent(e.target.value)}>
              {SET_ACCENTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <div className={s.row}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ImageUploader folder="sets" label="Imagen 1 · Portada" max={1} value={cover} onChange={setCover} error={errors.image} hint="Se muestra en el carrusel del inicio y en la lista de sets." />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ImageUploader folder="sets" label="Imagen 2 · Detalle" max={1} value={detail} onChange={setDetail} error={errors.imageDetail} hint="Se muestra grande en la página del set." />
          </div>
        </div>

        <div className={s.field}>
          <label>Productos del set ({selected.length}/{MAX_SET_PRODUCTS}, mínimo {MIN_SET_PRODUCTS})</label>
          <input style={{ marginBottom: '0.5rem' }} placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {products.length === 0 ? (
            <div className={s.empty}>Primero cargá productos.</div>
          ) : (
            <div className={s.picker}>
              {visible.map((p) => {
                const order = selected.indexOf(p.id)
                return (
                  <label key={p.id} className={s.pickerItem} style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.88rem', marginBottom: 0 }}>
                    <input type="checkbox" checked={order !== -1} onChange={() => toggle(p.id)} />
                    {p.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt="" className={s.thumb} />
                    )}
                    <span>{p.name}</span>
                    <span className={`${s.dim} ${s.small}`}>{p.category}{p.is_active ? '' : ' · inactivo'}</span>
                    {order !== -1 && <span className={s.pickerOrder}>#{order + 1}</span>}
                  </label>
                )
              })}
              {visible.length === 0 && <div className={s.empty}>Sin resultados.</div>}
            </div>
          )}
          {err('productIds')}
        </div>

        <div className={s.modalFooter}>
          <button type="button" className={`${s.btn} ${s.btnOutline}`} onClick={handleCancel} disabled={pending}>Cancelar</button>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={pending}>
            {pending ? 'Guardando…' : 'Guardar set'}
          </button>
        </div>
      </form>
    </div>
  )
}
