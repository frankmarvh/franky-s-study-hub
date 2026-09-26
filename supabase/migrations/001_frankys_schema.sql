-- ============================================================
-- FRANKY'S STUDY HUB
-- Core Database Schema
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

  user_id uuid not null references auth.users(id) on delete cascade,

  role text not null default 'user'
    check (role in ('user', 'admin')),

  created_at timestamptz not null default now(),

  unique(user_id)
);

-- ============================================================
-- MATERIALS
-- ============================================================

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  description text,

  university text not null,

  course text not null,

  unit_code text,

  unit_name text not null,

  year_of_study integer
    check (
      year_of_study is null
      or year_of_study between 1 and 8
    ),

  semester integer
    check (
      semester is null
      or semester between 1 and 3
    ),

  material_type text not null default 'notes'
    check (
      material_type in (
        'notes',
        'past_paper',
        'assignment',
        'revision',
        'book',
        'other'
      )
    ),

  file_path text,

  external_url text,

  content text,

  is_published boolean not null default true,

  created_by uuid references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_materials_university
on public.materials(university);

create index if not exists idx_materials_course
on public.materials(course);

create index if not exists idx_materials_unit_name
on public.materials(unit_name);

create index if not exists idx_materials_material_type
on public.materials(material_type);

create index if not exists idx_materials_year
on public.materials(year_of_study);

create index if not exists idx_materials_semester
on public.materials(semester);

create index if not exists idx_materials_created_at
on public.materials(created_at desc);

-- ============================================================
-- UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.update_updated_at_column()
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

drop trigger if exists update_profiles_updated_at
on public.profiles;

create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

drop trigger if exists update_materials_updated_at
on public.materials;

create trigger update_materials_updated_at
before update on public.materials
for each row
execute function public.update_updated_at_column();

-- ============================================================
-- CREATE PROFILE AFTER REGISTRATION
-- ============================================================

create or replace function public.handle_new_user()
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
  on conflict (id) do nothing;

  insert into public.user_roles (
    user_id,
    role
  )
  values (
    new.id,
    'user'
  )
  on conflict (user_id) do nothing;

  return new;

end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================
-- ROLE CHECK FUNCTION
-- ============================================================

create or replace function public.has_role(
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
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles
enable row level security;

alter table public.user_roles
enable row level security;

alter table public.materials
enable row level security;

-- ============================================================
-- REMOVE OLD POLICIES IF THEY EXIST
-- ============================================================

drop policy if exists
"Users can view own profile"
on public.profiles;

drop policy if exists
"Users can update own profile"
on public.profiles;

drop policy if exists
"Users can view own role"
on public.user_roles;

drop policy if exists
"Admins can view all roles"
on public.user_roles;

drop policy if exists
"Anyone can browse published materials"
on public.materials;

drop policy if exists
"Admins can view all materials"
on public.materials;

drop policy if exists
"Admins can insert materials"
on public.materials;

drop policy if exists
"Admins can update materials"
on public.materials;

drop policy if exists
"Admins can delete materials"
on public.materials;

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
"Admins can view all roles"
on public.user_roles
for select
to authenticated
using (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

-- IMPORTANT:
-- There is deliberately no normal-user INSERT or UPDATE policy
-- for user_roles.
--
-- A user cannot promote themselves to admin from the browser.

-- ============================================================
-- MATERIAL SELECT POLICIES
-- ============================================================

create policy
"Authenticated users can browse published materials"
on public.materials
for select
to authenticated
using (
  is_published = true
);

create policy
"Admins can view all materials"
on public.materials
for select
to authenticated
using (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

-- ============================================================
-- MATERIAL ADMIN POLICIES
-- ============================================================

create policy
"Admins can insert materials"
on public.materials
for insert
to authenticated
with check (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

create policy
"Admins can update materials"
on public.materials
for update
to authenticated
using (
  public.has_role(
    auth.uid(),
    'admin'
  )
)
with check (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

create policy
"Admins can delete materials"
on public.materials
for delete
to authenticated
using (
  public.has_role(
    auth.uid(),
    'admin'
  )
);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'materials',
  'materials',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id)
do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

drop policy if exists
"Authenticated users can read materials"
on storage.objects;

drop policy if exists
"Admins can upload materials"
on storage.objects;

drop policy if exists
"Admins can update material files"
on storage.objects;

drop policy if exists
"Admins can delete material files"
on storage.objects;

create policy
"Authenticated users can read materials"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'materials'
);

create policy
"Admins can upload materials"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'materials'
  and public.has_role(
    auth.uid(),
    'admin'
  )
);

create policy
"Admins can update material files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'materials'
  and public.has_role(
    auth.uid(),
    'admin'
  )
)
with check (
  bucket_id = 'materials'
  and public.has_role(
    auth.uid(),
    'admin'
  )
);

create policy
"Admins can delete material files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'materials'
  and public.has_role(
    auth.uid(),
    'admin'
  )
);
