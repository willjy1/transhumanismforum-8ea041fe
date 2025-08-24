-- Add editor role to the existing app_role enum
ALTER TYPE public.app_role ADD VALUE 'editor';

-- Give the current authenticated user editor role (you'll need to be logged in)
INSERT INTO public.user_roles (user_id, role) 
VALUES (auth.uid(), 'editor'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Create policy to allow editors to manage moderator roles
CREATE POLICY "Editors can manage moderator roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (
  -- Editors can see/manage moderator and user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
)
WITH CHECK (
  -- Editors can only assign moderator or user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
);

-- Create policy to allow editors to see all user roles for management
CREATE POLICY "Editors can view all user roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'editor'::app_role));