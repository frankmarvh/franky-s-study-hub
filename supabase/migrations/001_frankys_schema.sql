-- ============================================================
-- FRANKY'S STUDY HUB
-- DATABASE SCHEMA
-- Open Educational Resources Architecture
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  avatar_url text,
  university text,
  course text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- USER ROLES
-- ============================================================

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  role text not null default 'user'
    check (
      role in ('user', 'admin')
    ),

  created_at timestamptz not null default now(),

  unique(user_id)
);

-- ============================================================
-- SAVED MATERIALS
-- Stores LINKS + metadata, NOT uploaded copyrighted files.
-- ============================================================

create table if not exists public.saved_materials (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null,

  description text,

  source text not null,

  source_url text not null,

  subject text,

  resource_type text,

  license text,

  thumbnail_url text,

  created_at timestamptz not null default now(),

  unique(user_id, source_url)
);

-- ============================================================
-- SEARCH HISTORY
-- ============================================================

create table if not exists public.material_searches (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  query text not null,

  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists
idx_saved_materials_user
on public.saved_materials(user_id);

create index if not exists
idx_saved_materials_subject
on public.saved_materials(subject);

create index if not exists
idx_searches_user
on public.material_searches(user_id);

create index if not exists
idx_searches_created
on public.material_searches(created_at desc);

-- ============================================================
-- UPDATED AT
-- ============================================================

create or replace function
public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
update_profiles_updated_at
on public.profiles;

create trigger
update_profiles_updated_at
before update on public.profiles
for each row
execute function
public.update_updated_at_column();

-- ============================================================
-- AUTOMATIC USER CREATION
-- ============================================================

create or replace function
public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    avatar_url
  )
  values (
    new.id,

    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),

    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id)
  do nothing;

  insert into public.user_roles (
    user_id,
    role
  )
  values (
    new.id,
    'user'
  )
  on conflict (user_id)
  do nothing;

  return new;

end;
$$;

drop trigger if exists
on_auth_user_created
on auth.users;

create trigger
on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================
-- ROLE CHECK
-- ============================================================

create or replace function
public.has_role(
  requested_user_id uuid,
  requested_role text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$

  select exists (
    select 1
    from public.user_roles
    where user_id = requested_user_id
      and role = requested_role
  );

$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles
enable row level security;

alter table public.user_roles
enable row level security;

alter table public.saved_materials
enable row level security;

alter table public.material_searches
enable row level security;

-- ============================================================
-- PROFILE POLICIES
-- ============================================================

create policy
"Users can view own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
);

create policy
"Users can update own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);

-- ============================================================
-- ROLE POLICIES
-- ============================================================

create policy
"Users can view own role"
on public.user_roles
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
"Admins can view roles"
on public.user_roles
for select
to authenticated
using (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

-- ============================================================
-- SAVED MATERIAL POLICIES
-- ============================================================

create policy
"Users can view saved materials"
on public.saved_materials
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
"Users can save materials"
on public.saved_materials
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy
"Users can delete saved materials"
on public.saved_materials
for delete
to authenticated
using (
  auth.uid() = user_id
);

-- ============================================================
-- SEARCH HISTORY POLICIES
-- ============================================================

create policy
"Users can view search history"
on public.material_searches
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
"Users can create search history"
on public.material_searches
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy
"Users can delete search history"
on public.material_searches
for delete
to authenticated
using (
  auth.uid() = user_id
);
