-- Update donors table to match TypeScript types
ALTER TABLE public.donors 
ADD COLUMN IF NOT EXISTS batch text,
ADD COLUMN IF NOT EXISTS phone2 text,
ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'normal' CHECK (urgency in ('low', 'normal', 'high', 'critical'));

-- Update requests table to match TypeScript types
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS hospital text,
ADD COLUMN IF NOT EXISTS ward text,
ADD COLUMN IF NOT EXISTS contact_phone2 text,
ADD COLUMN IF NOT EXISTS requested_by text,
ADD COLUMN IF NOT EXISTS relation_to_patient text,
ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'normal' CHECK (urgency in ('low', 'normal', 'high', 'critical'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_department ON public.donors(department);
CREATE INDEX IF NOT EXISTS idx_donors_willing ON public.donors(willing);
CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON public.requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_needed_by ON public.requests(needed_by);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON public.requests(urgency);

-- Update existing data to have default values
UPDATE public.donors SET batch = substring(student_id, 1, 4) WHERE batch IS NULL;
UPDATE public.requests SET urgency = 'normal' WHERE urgency IS NULL;
