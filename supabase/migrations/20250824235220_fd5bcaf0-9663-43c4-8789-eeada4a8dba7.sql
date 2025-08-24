-- Create policy to allow editors to insert moderator roles
CREATE POLICY "Editors can assign moderator roles" 
ON public.user_roles 
FOR INSERT
TO authenticated
WITH CHECK (
  -- Editors can only assign moderator or user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
);

-- Create policy to allow editors to update moderator roles
CREATE POLICY "Editors can update moderator roles" 
ON public.user_roles 
FOR UPDATE
TO authenticated
USING (
  -- Editors can see/manage moderator and user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
)
WITH CHECK (
  -- Editors can only assign moderator or user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
);

-- Create policy to allow editors to delete moderator roles
CREATE POLICY "Editors can remove moderator roles" 
ON public.user_roles 
FOR DELETE
TO authenticated
USING (
  -- Editors can see/manage moderator and user roles
  public.has_role(auth.uid(), 'editor'::app_role) AND role IN ('moderator'::app_role, 'user'::app_role)
);

-- Create policy to allow editors to see all user roles for management
CREATE POLICY "Editors can view all user roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'editor'::app_role));