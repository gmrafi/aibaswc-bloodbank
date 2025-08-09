-- Add extra donor fields: batch and phone2
alter table public.donors add column if not exists batch text;
alter table public.donors add column if not exists phone2 text;

-- Add extra request fields
alter table public.requests add column if not exists hospital text;
alter table public.requests add column if not exists ward text;
alter table public.requests add column if not exists contact_phone2 text;
alter table public.requests add column if not exists requested_by text;
alter table public.requests add column if not exists relation_to_patient text;
alter table public.requests add column if not exists urgency text check (urgency in ('low','normal','high','critical')) default 'normal';
