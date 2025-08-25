-- Fix profiles table RLS policies to protect personal information

-- Remove existing overly permissive policies
DROP POLICY IF EXISTS "Public can view minimal profile info for posts" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view full profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create secure policies for profiles table
-- 1. Allow authenticated users to view all profile information
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Users can view only their own profile without authentication (for profile setup)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 3. For public post display, create a more restrictive approach
-- We'll handle this through a view or by ensuring auth is required for posts

-- Ensure other critical policies remain intact
-- Users can still insert and update their own profiles
-- (These policies should already exist but let's be explicit)

-- Verify insert policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END
$$;

-- Verify update policy exists  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;
END
$$;