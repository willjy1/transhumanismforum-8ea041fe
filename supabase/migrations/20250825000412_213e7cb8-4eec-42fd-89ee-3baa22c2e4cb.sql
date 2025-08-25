-- Fix user roles exposure - remove public read access
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;

-- Only authenticated users can view user roles
CREATE POLICY "Authenticated users can view user roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (true);

-- Admins and editors can see all roles, others can only see their own
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'editor'::app_role)
);