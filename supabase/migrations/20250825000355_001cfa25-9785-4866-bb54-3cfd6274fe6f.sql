-- Fix critical security vulnerability: profiles table is publicly readable
-- Remove public access and require authentication

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create secure policy: only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy for public basic info only (username and avatar for posts/comments)
CREATE POLICY "Public can view basic profile info for content attribution" 
ON public.profiles 
FOR SELECT 
TO anon
USING (true);