-- Fix post_views table security - first drop all existing policies
DROP POLICY IF EXISTS "Post views are viewable by everyone" ON public.post_views;
DROP POLICY IF EXISTS "Authenticated users can view post views" ON public.post_views;
DROP POLICY IF EXISTS "Anyone can create post views" ON public.post_views;

-- Remove IP and user_agent tracking columns for privacy
ALTER TABLE public.post_views DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.post_views DROP COLUMN IF EXISTS user_agent;

-- Create new secure policies
-- Allow anonymous users to create views (for tracking), but no read access
CREATE POLICY "Anyone can record post views" 
ON public.post_views 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only editors and admins can view analytics data
CREATE POLICY "Editors can view post analytics" 
ON public.post_views 
FOR SELECT 
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'editor'::app_role)
);