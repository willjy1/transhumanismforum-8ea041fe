-- Add follow functionality
-- Create user_follows table (different from existing follows table which may have different structure)
DROP TABLE IF EXISTS public.follows CASCADE;

CREATE TABLE public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (follower_id, following_id),
    CHECK (follower_id != following_id) -- Prevent self-following
);

-- Enable RLS on user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Create policies for user_follows
CREATE POLICY "User follows are viewable by everyone"
ON public.user_follows
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can follow others"
ON public.user_follows
FOR INSERT 
WITH CHECK (
    auth.uid() = follower_id 
    AND follower_id != following_id
);

CREATE POLICY "Users can unfollow others"
ON public.user_follows
FOR DELETE 
USING (auth.uid() = follower_id);

-- Add follower/following counts to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Create function to update follow counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increase follower count for the followed user
        UPDATE public.profiles 
        SET followers_count = followers_count + 1 
        WHERE id = NEW.following_id;
        
        -- Increase following count for the follower
        UPDATE public.profiles 
        SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrease follower count for the unfollowed user
        UPDATE public.profiles 
        SET followers_count = followers_count - 1 
        WHERE id = OLD.following_id;
        
        -- Decrease following count for the unfollower
        UPDATE public.profiles 
        SET following_count = following_count - 1 
        WHERE id = OLD.follower_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create triggers for follow count updates
CREATE TRIGGER update_follow_counts_insert
AFTER INSERT ON public.user_follows
FOR EACH ROW
EXECUTE FUNCTION public.update_follow_counts();

CREATE TRIGGER update_follow_counts_delete
AFTER DELETE ON public.user_follows
FOR EACH ROW
EXECUTE FUNCTION public.update_follow_counts();

-- Initialize follow counts for existing profiles
UPDATE public.profiles SET 
    followers_count = (
        SELECT COUNT(*) FROM public.user_follows WHERE following_id = profiles.id
    ),
    following_count = (
        SELECT COUNT(*) FROM public.user_follows WHERE follower_id = profiles.id
    );