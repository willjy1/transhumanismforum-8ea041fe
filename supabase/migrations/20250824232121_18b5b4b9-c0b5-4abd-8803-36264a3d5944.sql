-- Add foreign key constraint to link notes to profiles
ALTER TABLE public.notes 
ADD CONSTRAINT notes_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;