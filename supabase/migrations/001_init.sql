-- Valora B2B Initial Schema

create extension if not exists "pgcrypto";

-- 1. Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_language text default 'fr' check (preferred_language in ('en', 'fr')),
  created_at timestamptz not null default now()
);

-- 2. Organizations (Quebec Enterprise Entities)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  neq text unique, -- Numéro d'entreprise du Québec (10 digits)
  role text not null default 'vendor' check (role in ('vendor', 'buyer', 'both')),
  industry text,
  size text check (size in ('1-9', '10-49', '50-199', '200+')),
  description_en text,
  description_fr text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Memberships (linking profiles to organizations)
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique(profile_id, org_id)
);

-- 4. Procurements (RFP/RFQ listings posted by buyers)
create table if not exists public.procurements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  title_en text not null,
  title_fr text not null,
  description_en text,
  description_fr text,
  requirements_en text,
  requirements_fr text,
  budget_cents bigint,
  deadline timestamptz,
  status text not null default 'open' check (status in ('draft', 'open', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Matches (AI Matchmaking results)
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  procurement_id uuid not null references public.procurements (id) on delete cascade,
  vendor_org_id uuid not null references public.organizations (id) on delete cascade,
  score int not null check (score >= 0 and score <= 100),
  reasoning_en text,
  reasoning_fr text,
  status text not null default 'suggested' check (status in ('suggested', 'interested', 'declined', 'connected')),
  created_at timestamptz not null default now(),
  unique(procurement_id, vendor_org_id)
);

-- Indexes for performance
create index if not exists memberships_profile_id_idx on public.memberships (profile_id);
create index if not exists memberships_org_id_idx on public.memberships (org_id);
create index if not exists procurements_org_id_idx on public.procurements (org_id);
create index if not exists matches_procurement_id_idx on public.matches (procurement_id);
create index if not exists matches_vendor_org_id_idx on public.matches (vendor_org_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger for updating updated_at timestamp
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create trigger procurements_updated_at
  before update on public.procurements
  for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.procurements enable row level security;
alter table public.matches enable row level security;

-- RLS Policies

-- Profiles: Users can see and update their own profiles
create policy "Allow profiles select for self" on public.profiles
  for select using (auth.uid() = id);

create policy "Allow profiles update for self" on public.profiles
  for update using (auth.uid() = id);

-- Memberships: Users can see memberships for orgs they belong to
create policy "Allow memberships select for member" on public.memberships
  for select using (
    exists (
      select 1 from public.memberships m
      where m.org_id = memberships.org_id and m.profile_id = auth.uid()
    )
  );

-- Organizations: Orgs visible to their members, or vendors visible to buyers (and vice versa)
create policy "Allow organization select if member or role-related" on public.organizations
  for select using (
    exists (
      select 1 from public.memberships m
      where m.org_id = id and m.profile_id = auth.uid()
    ) or true -- basic search allows seeing org directory details
  );

create policy "Allow organization insert if authenticated" on public.organizations
  for insert with check (auth.role() = 'authenticated');

create policy "Allow organization update/delete for owner/admin" on public.organizations
  for update using (
    exists (
      select 1 from public.memberships m
      where m.org_id = id and m.profile_id = auth.uid() and m.role in ('owner', 'admin')
    )
  );

-- Procurements: All buyers and matched vendors can select open listings; owners can modify
create policy "Allow procurements select" on public.procurements
  for select using (
    status = 'open' or
    exists (
      select 1 from public.memberships m
      where m.org_id = org_id and m.profile_id = auth.uid()
    )
  );

create policy "Allow procurements modify for org admin" on public.procurements
  for all using (
    exists (
      select 1 from public.memberships m
      where m.org_id = org_id and m.profile_id = auth.uid() and m.role in ('owner', 'admin')
    )
  );

-- Matches: Matched vendors or procurement authors can view
create policy "Allow matches select for matched parties" on public.matches
  for select using (
    exists (
      select 1 from public.memberships m
      where m.profile_id = auth.uid() and (m.org_id = vendor_org_id or exists (
        select 1 from public.procurements p
        where p.id = procurement_id and p.org_id = m.org_id
      ))
    )
  );
