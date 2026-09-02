-- Launchkit storefront schema: user profiles + order history.
-- Prefixed with launchkit_ so these tables never collide with anything
-- else already in the Supabase project you point this at.
--
-- Run this once against a fresh Supabase project (SQL Editor, or via the
-- Supabase MCP / CLI as a migration) before sign-up/sign-in will work.

create table if not exists public.launchkit_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  locale text not null default 'en' check (locale in ('en', 'ar')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.launchkit_profiles is 'Launchkit storefront: one row per signed-up user, extending auth.users.';

alter table public.launchkit_profiles enable row level security;

create policy "launchkit_profiles: users can view their own profile"
  on public.launchkit_profiles for select
  using (auth.uid() = id);

create policy "launchkit_profiles: users can update their own profile"
  on public.launchkit_profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.launchkit_handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.launchkit_profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists launchkit_on_auth_user_created on auth.users;
create trigger launchkit_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.launchkit_handle_new_user();

-- Only needed as a trigger (reads the special `new` record, which only
-- exists in trigger context) — revoke direct RPC execute access.
revoke execute on function public.launchkit_handle_new_user() from public, anon, authenticated;

-- Purchase history — populated later by a Paddle webhook. Empty until then.
create table if not exists public.launchkit_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null,
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  paddle_transaction_id text,
  created_at timestamptz not null default now()
);

comment on table public.launchkit_orders is 'Launchkit storefront: purchase history, populated by a future Paddle webhook.';

alter table public.launchkit_orders enable row level security;

create policy "launchkit_orders: users can view their own orders"
  on public.launchkit_orders for select
  using (auth.uid() = user_id);

-- NOTE: this file is already behind the live schema as of the admin-system
-- work below — it's missing launchkit_wishlist, launchkit_product_ownership,
-- and the demo-purchase RLS policies added in an earlier session. Treat this
-- file as a rough starting point for a fresh project, not a source of truth;
-- the live Supabase project's migration history is authoritative.

-- ── Admin system ────────────────────────────────────────────────────────

alter table public.launchkit_profiles add column if not exists is_admin boolean not null default false;

comment on column public.launchkit_profiles.is_admin is
  'Storefront admin. Only settable via launchkit_set_admin() — users cannot grant it to themselves.';

-- Users may only self-edit name/locale, never is_admin — without this,
-- the RLS policy above (auth.uid() = id) would let anyone grant themselves
-- admin from the browser console, since Postgres grants table-level UPDATE
-- to anon/authenticated by default regardless of RLS.
revoke update on public.launchkit_profiles from anon, authenticated;
grant update (full_name, locale, updated_at) on public.launchkit_profiles to authenticated;

create or replace function public.launchkit_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.launchkit_profiles where id = auth.uid()), false);
$$;
revoke execute on function public.launchkit_is_admin() from public, anon;
grant execute on function public.launchkit_is_admin() to authenticated;

-- Only an existing admin may grant/revoke; nobody can demote themselves.
create or replace function public.launchkit_set_admin(target_user uuid, make_admin boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.launchkit_is_admin() then raise exception 'not authorized'; end if;
  if target_user = auth.uid() and make_admin is false then
    raise exception 'you cannot remove your own admin access';
  end if;
  update public.launchkit_profiles set is_admin = make_admin, updated_at = now() where id = target_user;
end; $$;
revoke execute on function public.launchkit_set_admin(uuid, boolean) from public, anon;
grant execute on function public.launchkit_set_admin(uuid, boolean) to authenticated;

create policy "launchkit_profiles: admins can view all profiles" on public.launchkit_profiles
  for select to authenticated using (public.launchkit_is_admin());
create policy "launchkit_orders: admins can view all orders" on public.launchkit_orders
  for select to authenticated using (public.launchkit_is_admin());
-- (a matching policy also exists on launchkit_product_ownership, not defined
-- in this file — see the NOTE above)

-- ── Products catalog ────────────────────────────────────────────────────
-- Replaces the old hardcoded src/lib/products.ts array. slug is the natural
-- key everywhere else in the app (orders, wishlist, ownership all reference
-- it as free text with no FK), so there's no separate id column.

create table public.launchkit_products (
  slug text primary key,
  name jsonb not null, tagline jsonb not null, description jsonb not null,
  who_its_for jsonb not null, who_its_not_for jsonb not null,
  category_slug text not null check (category_slug in ('marketing-sites','dashboard-ui-kits','ui-kits','bundles')),
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price >= 0),
  demo_url text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}', tech_stack text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true, -- soft delete: no FK exists to cascade a hard delete safely
  released_at date not null default current_date, -- was Product.createdAt
  version text not null default '1.0.0',
  last_updated date not null default current_date,
  paddle_price_id text unique,
  features jsonb not null default '{"en":[],"ar":[]}'::jsonb,
  includes jsonb not null default '{"en":[],"ar":[]}'::jsonb,
  not_included jsonb not null default '{"en":[],"ar":[]}'::jsonb,
  requirements jsonb not null default '{"en":[],"ar":[]}'::jsonb,
  pages_included text[], components_included text[],
  file_tree text not null default '',
  how_it_works jsonb not null default '[]'::jsonb,
  changelog jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.launchkit_products enable row level security;

create policy "launchkit_products: anyone can read" on public.launchkit_products for select using (true);
create policy "launchkit_products: admins can insert" on public.launchkit_products
  for insert to authenticated with check (public.launchkit_is_admin());
create policy "launchkit_products: admins can update" on public.launchkit_products
  for update to authenticated using (public.launchkit_is_admin()) with check (public.launchkit_is_admin());
-- No delete policy — unpublish via the `published` column instead.

-- Seed data (the 4 real products) is not reproduced here — it's ~700 lines
-- of bilingual content. It was generated from the original TS array via the
-- TypeScript compiler rather than hand-typed; see the migration history in
-- the Supabase project (launchkit_products_seed) for the actual INSERTs.

-- The first admin is granted directly, e.g.:
--   update public.launchkit_profiles set is_admin = true where email = 'you@example.com';
