import { useEmissions } from '../hooks/useEmissions'
import { EmissionCard } from './EmissionCard'
import { EmissionForm } from './EmissionForm'

export function EmissionsTracker() {
  const { emissions, totalCo2, loading, submitting, error, addEmission, refetch } = useEmissions()

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold">Dashboard de Emisiones</h1>
        <p className="text-lg font-semibold">Total: {totalCo2.toLocaleString('es-CO')} kg CO₂</p>
      </header>

      <EmissionForm onSubmit={addEmission} isSubmitting={submitting} />

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Error: {error}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md bg-red-600 px-3 py-1.5 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div key={n} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : emissions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          Aún no hay mediciones. Agrega la primera.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emissions.map((e) => (
            <li key={e.id}>
              <EmissionCard emission={e} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
