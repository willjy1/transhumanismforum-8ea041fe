-- Assign editor role to the current user (replace with actual user ID)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('9624ad9e-0aae-4407-bc78-17240b94b7db', 'editor'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;