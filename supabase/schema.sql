-- ABEE Muslim — skema Supabase
-- Jalankan file ini di Supabase Dashboard > SQL Editor.
-- Aplikasi bekerja penuh TANPA Supabase (localStorage). Tabel ini hanya
-- dipakai untuk sinkronisasi progres antar perangkat (per device_id anonim).

create table if not exists public.user_progress (
  device_id text primary key,
  name text not null default 'Teman ABEE',
  city text not null default 'Bangil',
  points integer not null default 0,
  streak integer not null default 0,
  last_active_date date,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Izinkan baca/tulis anonim untuk demo (tanpa login). Untuk produksi,
-- aktifkan Supabase Auth dan batasi policy per user_id.
alter table public.user_progress enable row level security;

drop policy if exists "anon read" on public.user_progress;
create policy "anon read" on public.user_progress
  for select using (true);

drop policy if exists "anon write" on public.user_progress;
create policy "anon write" on public.user_progress
  for insert with check (true);

drop policy if exists "anon update" on public.user_progress;
create policy "anon update" on public.user_progress
  for update using (true);

-- Peringkat (opsional): view 10 besar berdasarkan poin.
create or replace view public.leaderboard_top10 as
select device_id, name, points, streak
from public.user_progress
order by points desc
limit 10;
