'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import { IMAGE_EXT, IMAGE_MIME_TYPES, STORAGE_BUCKET, validateImageFile } from '@/app/lib/validation'
import s from '@/app/admin/admin.module.css'

type Props = {
  folder: 'products' | 'sets'
  value: string[]
  onChange: (urls: string[]) => void
  max: number
  label: string
  error?: string
  hint?: string
}

const PUBLIC_PREFIX = `/storage/v1/object/public/${STORAGE_BUCKET}/`

/** Borra del bucket archivos subidos que ya no se usan (cancelar, quitar, error al guardar). */
export async function removeUploadedImages(urls: string[]) {
  const paths = urls.map((url) => url.split(PUBLIC_PREFIX)[1]).filter(Boolean)
  if (!paths.length) return
  try {
    await createClient().storage.from(STORAGE_BUCKET).remove(paths)
  } catch {
    // Mejor esfuerzo: un archivo huérfano no rompe nada.
  }
}

export default function ImageUploader({ folder, value, onChange, max, label, error, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState('')

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? [])
    if (inputRef.current) inputRef.current.value = ''
    if (!files.length) return

    setLocalError('')
    if (value.length + files.length > max) {
      setLocalError(`Podés subir hasta ${max} imagen${max === 1 ? '' : 'es'}.`)
      return
    }
    const invalid = files.map(validateImageFile).find(Boolean)
    if (invalid) {
      setLocalError(invalid)
      return
    }

    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []
    for (const file of files) {
      const path = `${folder}/${crypto.randomUUID()}.${IMAGE_EXT[file.type]}`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
      if (uploadError) {
        setLocalError('No se pudo subir la imagen. Verificá tu sesión e intentá de nuevo.')
        break
      }
      uploaded.push(supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl)
    }
    setUploading(false)
    if (uploaded.length) onChange([...value, ...uploaded])
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url))
    void removeUploadedImages([url])
  }

  function makeCover(url: string) {
    onChange([url, ...value.filter((u) => u !== url)])
  }

  const shownError = localError || error

  return (
    <div className={s.field}>
      <label>{label}</label>
      {value.length < max && (
        <label className={s.dropzone} style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.85rem' }}>
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_MIME_TYPES.join(',')}
            multiple={max > 1}
            hidden
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <strong>{uploading ? 'Subiendo…' : 'Elegir imagen' + (max > 1 ? 'es' : '')}</strong>
          <span>JPG, PNG, WebP o AVIF · máx. 5 MB c/u</span>
        </label>
      )}
      {value.length > 0 && (
        <div className={s.previews}>
          {value.map((url, index) => (
            <div className={s.preview} key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Imagen ${index + 1}`} />
              {max > 1 && index === 0 && <span className={s.previewBadge}>Portada</span>}
              <div className={s.previewActions}>
                {max > 1 && index > 0 && (
                  <button type="button" className={s.iconBtn} title="Usar como portada" onClick={() => makeCover(url)}>★</button>
                )}
                <button type="button" className={s.iconBtn} title="Quitar" onClick={() => remove(url)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {hint && !shownError && <div className={s.hint}>{hint}</div>}
      {shownError && <div className={s.fieldError} role="alert">{shownError}</div>}
    </div>
  )
}
