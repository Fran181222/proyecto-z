-- 1. Perfiles vinculados a Supabase Auth
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  surname text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- 2. Productos
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  price_by_size jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  filters text[] not null default '{}',
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Favoritos: relación usuario ↔ producto
create table public.user_wishlist (
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- 4. Reseñas: relación usuario ↔ producto
create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- 5. Índices: aceleran consultas frecuentes
create index products_active_created_at_idx
  on public.products (is_active, created_at desc);

create index wishlist_user_added_at_idx
  on public.user_wishlist (user_id, added_at desc);

create index reviews_product_created_at_idx
  on public.product_reviews (product_id, created_at desc);

-- 6. Activar Row Level Security
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.user_wishlist enable row level security;
alter table public.product_reviews enable row level security;

-- 7. Políticas de acceso
-- Un usuario solo puede leer/crear/modificar su propio perfil.
create policy "users_manage_own_profile"
on public.users
for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Cualquiera puede leer productos activos.
create policy "anyone_reads_active_products"
on public.products
for select
using (is_active = true);

-- Cada usuario solo maneja sus favoritos.
create policy "users_manage_own_wishlist"
on public.user_wishlist
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Cada usuario puede leer reseñas y gestionar solo las propias.
create policy "anyone_reads_reviews"
on public.product_reviews
for select
using (true);

create policy "users_manage_own_reviews"
on public.product_reviews
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());