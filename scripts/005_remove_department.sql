-- Remove department columns since we're using batch instead
ALTER TABLE public.donors DROP COLUMN IF EXISTS department;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS department;

-- Update any existing batch values to the new format if needed
-- This is a one-time migration to standardize batch format
UPDATE public.donors 
SET batch = CASE 
  WHEN batch ~ '^[0-9]+$' THEN 'BBA ' || batch
  WHEN batch = '' OR batch IS NULL THEN 'BBA 1'
  ELSE batch
END
WHERE batch IS NULL OR batch = '' OR batch ~ '^[0-9]+$';

UPDATE public.profiles 
SET batch = CASE 
  WHEN batch ~ '^[0-9]+$' THEN 'BBA ' || batch
  WHEN batch = '' OR batch IS NULL THEN 'BBA 1'
  ELSE batch
END
WHERE batch IS NULL OR batch = '' OR batch ~ '^[0-9]+$';
