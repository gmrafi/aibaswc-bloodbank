-- Add role column to profiles
alter table public.profiles
  add column if not exists role text
    check (role in ('user','admin','superadmin'))
    default 'user';

-- Optional: seed an admin manually later (via API) if needed.
