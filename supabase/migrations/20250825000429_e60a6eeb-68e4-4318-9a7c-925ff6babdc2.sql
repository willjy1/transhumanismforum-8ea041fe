-- Fix post_views table security - restrict access to IP and user agent data
DROP POLICY IF EXISTS "Post views are viewable by everyone" ON public.post_views;

-- Remove IP and user_agent tracking columns for privacy
ALTER TABLE public.post_views DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.post_views DROP COLUMN IF EXISTS user_agent;

-- Only authenticated users can view post analytics
CREATE POLICY "Authenticated users can view post views" 
ON public.post_views 
FOR SELECT 
TO authenticated
USING (true);

-- Only editors and admins can view analytics data
CREATE POLICY "Editors can view analytics" 
ON public.post_views 
FOR SELECT 
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'editor'::app_role)
);