-- Create notes table for social media style posts
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  parent_id UUID NULL REFERENCES public.notes(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes
CREATE POLICY "Notes are viewable by everyone" 
ON public.notes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create note_likes table for tracking likes
CREATE TABLE public.note_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(note_id, user_id)
);

-- Enable RLS for note_likes
ALTER TABLE public.note_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for note_likes
CREATE POLICY "Note likes are viewable by everyone"
ON public.note_likes
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like notes"
ON public.note_likes
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.note_likes
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update notes updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_notes_updated_at();

-- Create function to update likes count
CREATE OR REPLACE FUNCTION public.update_note_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.notes 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.note_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.notes 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.note_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for likes count updates
CREATE TRIGGER update_note_likes_count_insert
AFTER INSERT ON public.note_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_note_likes_count();

CREATE TRIGGER update_note_likes_count_delete
AFTER DELETE ON public.note_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_note_likes_count();

-- Create function to update replies count
CREATE OR REPLACE FUNCTION public.update_note_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.notes 
    SET replies_count = replies_count + 1 
    WHERE id = NEW.parent_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.notes 
    SET replies_count = replies_count - 1 
    WHERE id = OLD.parent_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for replies count updates
CREATE TRIGGER update_note_replies_count_insert
AFTER INSERT ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_note_replies_count();

CREATE TRIGGER update_note_replies_count_delete
AFTER DELETE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_note_replies_count();