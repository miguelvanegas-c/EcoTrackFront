export const CATEGORIES = ['Transporte', 'Energía', 'Residuos'] as const
export type Category = (typeof CATEGORIES)[number]

export interface Emission {
  id: string
  source_name: string
  category: Category
  co2_kg: number
  created_at: string
}

export type NewEmission = Pick<Emission, 'source_name' | 'category' | 'co2_kg'>
