create table if not exists public.profiles (
  clerk_user_id text primary key,
  batch text,
  department text,
  phone1 text,
  phone2 text,
  blood_group text check (blood_group in ('O-','O+','A-','A+','B-','B+','AB-','AB+')),
  updated_at timestamptz not null default now()
);
