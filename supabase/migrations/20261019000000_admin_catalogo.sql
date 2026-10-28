-- Panel de administración: roles, políticas de escritura y almacenamiento de imágenes.
-- Es idempotente: se puede ejecutar más de una vez sin romper nada.
--
-- NOTA: en la base remota `products.id` y `sets.id` son text (slug), no uuid como en
-- la migración inicial. Esta migración respeta ese esquema y no cambia tipos de id.

-- 1. Administradores ---------------------------------------------------------
-- Solo se agregan desde el SQL editor / service role (no hay policy de insert).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins_read_self" on public.admins;
create policy "admins_read_self"
on public.admins
for select
to authenticated
using (user_id = (select auth.uid()));

-- security definer: puede consultar `admins` aunque el rol que llama no tenga acceso directo.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Productos: columnas que usa la tienda -----------------------------------
alter table public.products
  add column if not exists description text not null default '',
  add column if not exists stock integer not null default 0,
  add column if not exists collection text not null default 'accesorios',
  add column if not exists subcollection text,
  add column if not exists plan text;

-- Restricciones de integridad (segunda barrera detrás de la validación del servidor).
alter table public.products drop constraint if exists products_stock_check;
alter table public.products add constraint products_stock_check check (stock >= 0);

alter table public.products drop constraint if exists products_name_len_check;
alter table public.products add constraint products_name_len_check
  check (char_length(name) between 2 and 120);

alter table public.products drop constraint if exists products_collection_check;
alter table public.products add constraint products_collection_check
  check (collection in ('italianas', 'accesorios', 'materiales'));

alter table public.products drop constraint if exists products_images_max_check;
alter table public.products add constraint products_images_max_check
  check (cardinality(images) <= 8);

-- 3. Sets: dos imágenes (portada y detalle) -----------------------------------
alter table public.sets
  add column if not exists accent text not null default 'rose',
  add column if not exists image_detail text,
  add column if not exists is_active boolean not null default true;

alter table public.sets drop constraint if exists sets_accent_check;
alter table public.sets add constraint sets_accent_check
  check (accent in ('rose', 'wine', 'pine', 'pink'));

alter table public.sets enable row level security;
alter table public.set_products enable row level security;

-- 4. Políticas ---------------------------------------------------------------
-- Productos: el público ya lee los activos (migración inicial). El admin gestiona todo.
drop policy if exists "admins_manage_products" on public.products;
create policy "admins_manage_products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Sets
drop policy if exists "anyone_reads_active_sets" on public.sets;
create policy "anyone_reads_active_sets"
on public.sets
for select
using (is_active = true);

drop policy if exists "admins_manage_sets" on public.sets;
create policy "admins_manage_sets"
on public.sets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "anyone_reads_set_products" on public.set_products;
create policy "anyone_reads_set_products"
on public.set_products
for select
using (true);

drop policy if exists "admins_manage_set_products" on public.set_products;
create policy "admins_manage_set_products"
on public.set_products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Lectura para el panel (usuarios, favoritos y reseñas de todos).
drop policy if exists "admins_read_users" on public.users;
create policy "admins_read_users"
on public.users
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins_read_wishlist" on public.user_wishlist;
create policy "admins_read_wishlist"
on public.user_wishlist
for select
to authenticated
using (public.is_admin());

-- 5. Storage: bucket público de lectura, escritura solo admin ------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog',
  'catalog',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins_upload_catalog" on storage.objects;
create policy "admins_upload_catalog"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'catalog' and public.is_admin());

drop policy if exists "admins_update_catalog" on storage.objects;
create policy "admins_update_catalog"
on storage.objects
for update
to authenticated
using (bucket_id = 'catalog' and public.is_admin());

drop policy if exists "admins_delete_catalog" on storage.objects;
create policy "admins_delete_catalog"
on storage.objects
for delete
to authenticated
using (bucket_id = 'catalog' and public.is_admin());

-- 6. Para dar permisos de admin (ejecutar a mano con TU email, una sola vez):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'tu-email@dominio.com';
