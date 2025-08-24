-- Create sequences system
CREATE TABLE IF NOT EXISTS public.sequences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.sequence_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id uuid REFERENCES public.sequences(id) ON DELETE CASCADE NOT NULL,
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(sequence_id, post_id),
    UNIQUE(sequence_id, order_index)
);

-- Create notifications system
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    related_post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL,
    related_comment_id uuid REFERENCES public.comments(id) ON DELETE SET NULL,
    related_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create moderation system
CREATE TABLE IF NOT EXISTS public.post_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reason text NOT NULL,
    description text,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.comment_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reason text NOT NULL,
    description text,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create analytics system
CREATE TABLE IF NOT EXISTS public.post_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action text NOT NULL,
    target_type text,
    target_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add bookmarks for users
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id, post_id)
);

-- Add karma/reputation to profiles if columns don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'karma') THEN
        ALTER TABLE public.profiles ADD COLUMN karma INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'post_count') THEN
        ALTER TABLE public.profiles ADD COLUMN post_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'comment_count') THEN
        ALTER TABLE public.profiles ADD COLUMN comment_count INTEGER DEFAULT 0;
    END IF;
END $$;