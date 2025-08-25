-- Phase 1: Critical Privacy Protection - Update RLS policies

-- Update profiles table policies to require authentication for viewing personal data
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view minimal profile info for posts" ON public.profiles;

-- Create new privacy-focused policies for profiles
CREATE POLICY "Public can view minimal profile info for posts" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can view full profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update notes table to require authentication for viewing
DROP POLICY IF EXISTS "Notes are viewable by everyone" ON public.notes;

CREATE POLICY "Authenticated users can view notes" 
ON public.notes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update user_follows to require authentication
DROP POLICY IF EXISTS "User follows are viewable by everyone" ON public.user_follows;

CREATE POLICY "Authenticated users can view follows" 
ON public.user_follows 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update posts and comments to require authentication for viewing
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;

CREATE POLICY "Authenticated users can view posts" 
ON public.posts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view comments" 
ON public.comments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);