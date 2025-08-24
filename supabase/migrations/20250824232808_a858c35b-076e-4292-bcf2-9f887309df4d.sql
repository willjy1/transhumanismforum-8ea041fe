-- Remove sequences and karma, add user roles system
-- First drop sequence-related tables and constraints
DROP TABLE IF EXISTS public.sequence_posts CASCADE;
DROP TABLE IF EXISTS public.sequences CASCADE;

-- Remove karma and sequence-related columns from profiles
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS karma CASCADE;

-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
ON public.user_roles
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Assign williamjoy as editor (need to find the user first)
-- We'll do this by username lookup
DO $$
DECLARE
    william_user_id UUID;
BEGIN
    -- Find williamjoy's user_id
    SELECT id INTO william_user_id 
    FROM public.profiles 
    WHERE username = 'williamjoy';
    
    -- If found, assign editor role
    IF william_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (william_user_id, 'editor')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;