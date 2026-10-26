import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import type { Emission, NewEmission } from '../types/emission'

const addUnique = (list: Emission[], item: Emission): Emission[] =>
  list.some((e) => e.id === item.id) ? list : [item, ...list]

export function useEmissions() {
  const [emissions, setEmissions] = useState<Emission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('emissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setEmissions((data ?? []) as Emission[])
    setLoading(false)
  }, [])

  const addEmission = useCallback(async (n: NewEmission): Promise<boolean> => {
    setSubmitting(true)
    setError(null)
    const { data, error: err } = await supabase.from('emissions').insert(n).select().single()
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return false
    }
    setEmissions((prev) => addUnique(prev, data as Emission))
    return true
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  useEffect(() => {
    const channel = supabase
      .channel('emissions-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'emissions' },
        (p) => setEmissions((prev) => addUnique(prev, p.new as Emission)),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  const totalCo2 = useMemo(
    () => emissions.reduce((sum, e) => sum + Number(e.co2_kg), 0),
    [emissions],
  )

  return { emissions, totalCo2, loading, submitting, error, addEmission, refetch }
}
