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

-- Enable RLS on all new tables
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sequences
CREATE POLICY "Sequences are viewable by everyone" ON public.sequences FOR SELECT USING (is_published = true OR auth.uid() = author_id);
CREATE POLICY "Users can create sequences" ON public.sequences FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own sequences" ON public.sequences FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own sequences" ON public.sequences FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for sequence_posts
CREATE POLICY "Sequence posts are viewable by everyone" ON public.sequence_posts FOR SELECT USING (true);
CREATE POLICY "Sequence authors can manage sequence posts" ON public.sequence_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sequences WHERE sequences.id = sequence_posts.sequence_id AND sequences.author_id = auth.uid())
);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create RLS policies for reports
CREATE POLICY "Users can create post reports" ON public.post_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own post reports" ON public.post_reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create comment reports" ON public.comment_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own comment reports" ON public.comment_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Create RLS policies for analytics
CREATE POLICY "Anyone can create post views" ON public.post_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Post views are viewable by everyone" ON public.post_views FOR SELECT USING (true);
CREATE POLICY "Users can create activity logs" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sequences_author_id ON public.sequences(author_id);
CREATE INDEX IF NOT EXISTS idx_sequence_posts_sequence_id ON public.sequence_posts(sequence_id);
CREATE INDEX IF NOT EXISTS idx_sequence_posts_post_id ON public.sequence_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON public.post_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_sequences_updated_at
    BEFORE UPDATE ON public.sequences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add karma/reputation to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS karma INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;