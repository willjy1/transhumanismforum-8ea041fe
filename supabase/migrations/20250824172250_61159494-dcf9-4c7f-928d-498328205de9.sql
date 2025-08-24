-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories for forum posts
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  votes_score INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  votes_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create messages table for direct messaging
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create featured thinkers table
CREATE TABLE public.featured_thinkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  website_url TEXT,
  key_works TEXT[],
  quotes TEXT[],
  field_of_expertise TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follows table for social networking
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_thinkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for categories
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT USING (true);

-- Create RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" 
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
  ON public.posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for votes
CREATE POLICY "Votes are viewable by everyone" 
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" 
  ON public.votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
  ON public.votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can send messages" 
  ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received" 
  ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Create RLS policies for featured thinkers
CREATE POLICY "Featured thinkers are viewable by everyone" 
  ON public.featured_thinkers FOR SELECT USING (true);

-- Create RLS policies for follows
CREATE POLICY "Follows are viewable by everyone" 
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create follows" 
  ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" 
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Create trigger function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial categories
INSERT INTO public.categories (name, description, color) VALUES
  ('Life Extension', 'Discussions about extending human lifespan and healthspan', '#10b981'),
  ('AI & AGI', 'Artificial General Intelligence and its implications for humanity', '#3b82f6'),
  ('Cybernetics', 'Enhancement of human capabilities through technology', '#8b5cf6'),
  ('Space Colonization', 'Human expansion beyond Earth', '#f59e0b'),
  ('Bioethics', 'Ethical considerations in human enhancement', '#ef4444'),
  ('Cryonics', 'Preservation and revival of human life', '#06b6d4'),
  ('Mind Uploading', 'Digital preservation of consciousness', '#ec4899'),
  ('Genetic Enhancement', 'Improving human biology through genetic modification', '#84cc16'),
  ('Philosophy', 'Philosophical implications of transhumanism', '#6366f1'),
  ('Technology', 'Emerging technologies relevant to human enhancement', '#f97316');

-- Insert sample featured thinkers
INSERT INTO public.featured_thinkers (name, bio, photo_url, website_url, key_works, quotes, field_of_expertise, display_order) VALUES
  ('Nick Bostrom', 'Swedish philosopher known for his work on existential risk, the anthropic principle, human enhancement ethics, and machine intelligence.', null, 'https://nickbostrom.com', ARRAY['Superintelligence', 'Anthropic Bias', 'Transhumanist Values'], ARRAY['The future of humanity is not predetermined. We have choices to make, individually and collectively.'], 'Existential Risk & AI Safety', 1),
  ('Ray Kurzweil', 'American inventor, futurist, and author known for his predictions about artificial intelligence and the technological singularity.', null, 'http://www.kurzweilai.net', ARRAY['The Singularity is Near', 'The Age of Spiritual Machines', 'How to Create a Mind'], ARRAY['We are approaching a point where technology will become the primary method by which we transcend the limitations of our biology.'], 'Technological Singularity', 2),
  ('Anders Sandberg', 'Swedish researcher at the Future of Humanity Institute, Oxford University, focusing on computational neuroscience, enhancement ethics, and existential risk.', null, 'http://www.aleph.se/andart/', ARRAY['Morphological Freedom', 'Whole Brain Emulation Roadmap'], ARRAY['We should be morphologically free - able to modify our bodies as we see fit.'], 'Enhancement Ethics', 3),
  ('Natasha Vita-More', 'Transhumanist philosopher, author, and artist known for her work on human enhancement and life extension.', null, 'http://natashavita-more.com', ARRAY['The Transhumanist Reader', 'Create/Recreate'], ARRAY['Design your life to include the changes that technology offers.'], 'Human Enhancement Design', 4),
  ('Max More', 'Philosopher and futurist, founder of the Extropy Institute and current President of Alcor Life Extension Foundation.', null, null, ARRAY['The Principles of Extropy'], ARRAY['Extropy means extending your life, your intelligence, your capabilities, and your freedom.'], 'Extropianism', 5);