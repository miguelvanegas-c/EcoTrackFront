import { memo } from 'react'
import type { Category, Emission } from '../types/emission'

const STYLES: Record<Category, string> = {
  Transporte: 'bg-blue-100 text-blue-800',
  Energía: 'bg-amber-100 text-amber-800',
  Residuos: 'bg-green-100 text-green-800',
}

export const EmissionCard = memo(function EmissionCard({ emission }: { emission: Emission }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <h3 className="truncate font-semibold" title={emission.source_name}>
          {emission.source_name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[emission.category]}`}
        >
          {emission.category}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold">
        {Number(emission.co2_kg).toLocaleString('es-CO')}
        <span className="ml-1 text-sm text-gray-500">kg CO₂</span>
      </p>
    </article>
  )
})
