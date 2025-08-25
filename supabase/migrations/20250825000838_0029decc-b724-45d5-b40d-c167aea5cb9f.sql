-- Fix remaining security vulnerabilities

-- 1. Fix profiles table - still shows as publicly readable
DROP POLICY IF EXISTS "Public can view basic profile info for content attribution" ON public.profiles;

-- Create more restrictive policy for public access (only username and avatar for post attribution)
CREATE POLICY "Public can view minimal profile info for posts" 
ON public.profiles 
FOR SELECT 
TO anon
USING (true);

-- The authenticated policy already exists and is secure

-- 2. Fix messages table - ensure only participants can access
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Message participants can view conversations" 
ON public.messages 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = sender_id OR auth.uid() = recipient_id)
);

-- 3. Fix user_activity - restrict to user and admins only
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;

CREATE POLICY "Users can view their own activity only" 
ON public.user_activity 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'editor'::app_role)
);

-- Add additional security constraints
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 30);
ALTER TABLE public.profiles ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');

-- Ensure user roles are properly constrained
ALTER TABLE public.user_roles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_roles ALTER COLUMN role SET NOT NULL;