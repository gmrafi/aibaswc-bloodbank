-- Update profiles table to include new fields for enhanced profile functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_donation timestamp with time zone,
ADD COLUMN IF NOT EXISTS willing boolean DEFAULT true;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_blood_group ON public.profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_willing ON public.profiles(willing);
CREATE INDEX IF NOT EXISTS idx_profiles_last_donation ON public.profiles(last_donation);

-- Update existing profiles to have default values
UPDATE public.profiles SET willing = true WHERE willing IS NULL;

-- Add comment to explain the new fields
COMMENT ON COLUMN public.profiles.last_donation IS 'Last blood donation date for eligibility calculation';
COMMENT ON COLUMN public.profiles.willing IS 'Whether the user is willing to donate blood';
