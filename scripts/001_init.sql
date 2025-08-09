-- Enable required extensions (in Supabase, uuid functions available via pgcrypto or gen_random_uuid)
create extension if not exists pgcrypto;

-- Donors table
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  student_id text not null,
  department text not null,
  blood_group text not null check (blood_group in ('O-','O+','A-','A+','B-','B+','AB-','AB+')),
  phone text not null,
  email text,
  contact_preference text check (contact_preference in ('Phone','WhatsApp','Email')),
  willing boolean not null default true,
  last_donation timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Requests table
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  blood_group text not null check (blood_group in ('O-','O+','A-','A+','B-','B+','AB-','AB+')),
  units int not null check (units > 0),
  needed_by date not null,
  location text not null,
  contact_person text not null,
  contact_phone text not null,
  notes text,
  status text not null check (status in ('open','fulfilled','cancelled')) default 'open',
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  matched_donor_ids uuid[] default '{}',
  updated_at timestamptz not null default now()
);

-- Optional: simple updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists donors_set_updated_at on public.donors;
create trigger donors_set_updated_at
before update on public.donors
for each row execute function public.set_updated_at();

drop trigger if exists requests_set_updated_at on public.requests;
create trigger requests_set_updated_at
before update on public.requests
for each row execute function public.set_updated_at();

-- Note: With Clerk auth, we keep API protected in Next.js and use service role on the server.
-- If you want RLS, we can add a clerk_user_id column and policies.
