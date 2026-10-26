-- Ejecuta este script en Supabase > SQL Editor

create table if not exists public.emissions (
  id          uuid primary key default gen_random_uuid(),
  source_name text not null,
  category    text not null check (category in ('Transporte', 'Energía', 'Residuos')),
  co2_kg      numeric not null check (co2_kg > 0),
  created_at  timestamptz not null default now()
);

alter table public.emissions enable row level security;

-- Para la demo: acceso abierto con la anon key (en producción, restringe por usuario)
create policy "emissions_select_demo" on public.emissions for select to anon, authenticated using (true);
create policy "emissions_insert_demo" on public.emissions for insert to anon, authenticated with check (true);

-- Habilitar tiempo real
alter publication supabase_realtime add table public.emissions;
