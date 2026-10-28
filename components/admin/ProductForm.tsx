'use client'

import { useState, useTransition } from 'react'
import { createProductAction } from '@/app/admin/(panel)/actions'
import {
  CATEGORIES, COLLECTIONS, MATERIALS, MAX_PRODUCT_IMAGES, slugify, validateProduct, type FieldErrors,
} from '@/app/lib/validation'
import ImageUploader, { removeUploadedImages } from './ImageUploader'
import s from '@/app/admin/admin.module.css'

type Props = { onClose: () => void; onSaved: () => void }

const EMPTY = {
  name: '', id: '', category: '', collection: 'accesorios', price: '', stock: '0',
  description: '', tags: '', priceBySizeRaw: '',
}

export default function ProductForm({ onClose, onSaved }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [idTouched, setIdTouched] = useState(false)
  const [materials, setMaterials] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [pending, startTransition] = useTransition()

  const set = (key: keyof typeof EMPTY, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  function buildPayload() {
    return {
      ...form,
      materials,
      images,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isActive: true,
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    const payload = buildPayload()

    // Validación inmediata en el navegador; el servidor vuelve a validar todo.
    const local = validateProduct(payload)
    if (!local.ok) {
      setErrors(local.errors)
      return
    }
    setErrors({})

    startTransition(async () => {
      const result = await createProductAction(payload)
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
    if (images.length) await removeUploadedImages(images)
    onClose()
  }

  const invalid = (key: string) => (errors[key] ? s.inputInvalid : undefined)
  const err = (key: string) => errors[key] && <div className={s.fieldError} role="alert">{errors[key]}</div>

  return (
    <div className={s.overlay}>
      <form className={`${s.modal} ${s.modalWide}`} onSubmit={handleSubmit} noValidate>
        <h2>Nuevo producto</h2>
        {formError && <div className={s.error} role="alert">{formError}</div>}

        <div className={s.row}>
          <div className={s.field}>
            <label htmlFor="p-name">Nombre</label>
            <input
              id="p-name" className={invalid('name')} maxLength={120} placeholder="Anillo Coral Glow"
              value={form.name}
              onChange={(e) => {
                set('name', e.target.value)
                if (!idTouched) set('id', slugify(e.target.value))
              }}
            />
            {err('name')}
          </div>
          <div className={s.field}>
            <label htmlFor="p-id">ID / URL</label>
            <input
              id="p-id" className={invalid('id')} maxLength={80} placeholder="anillo-coral-glow"
              value={form.id}
              onChange={(e) => { setIdTouched(true); set('id', slugify(e.target.value)) }}
            />
            {err('id') || <div className={s.hint}>Se usa en la URL: /productos/{form.id || 'id'}</div>}
          </div>
        </div>

        <div className={s.row}>
          <div className={s.field}>
            <label htmlFor="p-category">Categoría</label>
            <select id="p-category" className={invalid('category')} value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">Elegir…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {err('category')}
          </div>
          <div className={s.field}>
            <label htmlFor="p-collection">Colección</label>
            <select id="p-collection" className={invalid('collection')} value={form.collection} onChange={(e) => set('collection', e.target.value)}>
              {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            {err('collection')}
          </div>
        </div>

        <div className={s.row}>
          <div className={s.field}>
            <label htmlFor="p-price">Precio base (ARS)</label>
            <input id="p-price" className={invalid('price')} type="number" inputMode="decimal" min="0" step="0.01" placeholder="12500" value={form.price} onChange={(e) => set('price', e.target.value)} />
            {err('price')}
          </div>
          <div className={s.field}>
            <label htmlFor="p-stock">Stock</label>
            <input id="p-stock" className={invalid('stock')} type="number" inputMode="numeric" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
            {err('stock')}
          </div>
        </div>

        <div className={s.field}>
          <label htmlFor="p-desc">Descripción</label>
          <textarea id="p-desc" className={invalid('description')} rows={3} maxLength={2000} value={form.description} onChange={(e) => set('description', e.target.value)} />
          {err('description')}
        </div>

        <div className={s.field}>
          <label>Material (para los filtros de la tienda)</label>
          <div className={s.checkRow}>
            {MATERIALS.map((m) => (
              <label key={m} className={s.checkPill} style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.82rem' }}>
                <input
                  type="checkbox"
                  checked={materials.includes(m)}
                  onChange={(e) => setMaterials((prev) => (e.target.checked ? [...prev, m] : prev.filter((x) => x !== m)))}
                />
                {m}
              </label>
            ))}
          </div>
          {err('materials')}
        </div>

        <div className={s.row}>
          <div className={s.field}>
            <label htmlFor="p-tags">Tags (separados por coma)</label>
            <input id="p-tags" className={invalid('tags')} placeholder="nuevo, regalo" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
            {err('tags')}
          </div>
          <div className={s.field}>
            <label htmlFor="p-sizes">Precio por talle (opcional)</label>
            <input id="p-sizes" className={invalid('priceBySize')} placeholder="12=2400, 14=2600" value={form.priceBySizeRaw} onChange={(e) => set('priceBySizeRaw', e.target.value)} />
            {err('priceBySize')}
          </div>
        </div>

        <ImageUploader
          folder="products"
          label={`Imágenes (hasta ${MAX_PRODUCT_IMAGES})`}
          max={MAX_PRODUCT_IMAGES}
          value={images}
          onChange={setImages}
          error={errors.images}
          hint="La primera es la portada. Usá ★ para cambiarla."
        />

        <div className={s.modalFooter}>
          <button type="button" className={`${s.btn} ${s.btnOutline}`} onClick={handleCancel} disabled={pending}>Cancelar</button>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={pending}>
            {pending ? 'Guardando…' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </div>
  )
}
