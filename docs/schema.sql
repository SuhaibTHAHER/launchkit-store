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
