import { useId, useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type NewEmission } from '../types/emission'

interface Props {
  onSubmit: (e: NewEmission) => Promise<boolean>
  isSubmitting: boolean
}

export function EmissionForm({ onSubmit, isSubmitting }: Props) {
  const id = useId()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('Transporte')
  const [co2, setCo2] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const cls = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const v = Number(co2)
    if (!name.trim()) return setMsg('El nombre de la fuente es obligatorio.')
    if (!Number.isFinite(v) || v <= 0) return setMsg('El CO₂ debe ser mayor que 0.')
    setMsg(null)
    if (await onSubmit({ source_name: name.trim(), category, co2_kg: v })) {
      setName('')
      setCo2('')
      setCategory('Transporte')
    }
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      noValidate
      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <label htmlFor={id + 'n'} className="text-sm font-medium">Fuente</label>
        <input
          id={id + 'n'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!msg && !name.trim()}
          className={cls}
        />
      </div>
      <div>
        <label htmlFor={id + 'c'} className="text-sm font-medium">Categoría</label>
        <select
          id={id + 'c'}
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={cls}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={id + 'o'} className="text-sm font-medium">CO₂ (kg)</label>
        <input
          id={id + 'o'}
          type="number"
          min="0"
          step="any"
          value={co2}
          onChange={(e) => setCo2(e.target.value)}
          aria-invalid={!!msg && !(Number(co2) > 0)}
          className={cls}
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Agregar medición'}
        </button>
      </div>
      {msg && (
        <p role="alert" className="text-sm text-red-600 sm:col-span-2 lg:col-span-4">
          {msg}
        </p>
      )}
    </form>
  )
}
