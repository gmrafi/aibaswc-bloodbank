-- Hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hospitals_name ON public.hospitals USING GIN (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_hospitals_lat_lng ON public.hospitals(latitude, longitude);

-- Requests: optional hospital_id and coords
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

COMMENT ON COLUMN public.requests.latitude IS 'Latitude for the request location (optional)';
COMMENT ON COLUMN public.requests.longitude IS 'Longitude for the request location (optional)';

ALTER TABLE public.requests
  ALTER COLUMN updated_at SET DEFAULT now();

-- Simple RLS suggestions (if you enable RLS)
-- ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read hospitals" ON public.hospitals FOR SELECT USING (true);
