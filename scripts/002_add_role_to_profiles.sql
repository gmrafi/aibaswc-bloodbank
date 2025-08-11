-- Add role column to profiles table for proper RBAC
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update existing profiles to have user role if null
UPDATE profiles SET role = 'user' WHERE role IS NULL;
