-- Revert posts table changes and create proper junction table approach
ALTER TABLE public.posts 
DROP COLUMN category_ids;

ALTER TABLE public.posts 
ADD COLUMN category_id UUID;

-- Create a junction table for post-category relationships
CREATE TABLE public.post_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  category_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for post_categories
CREATE POLICY "Post categories are viewable by everyone" 
ON public.post_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authors can manage their post categories" 
ON public.post_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_categories.post_id 
    AND posts.author_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_categories.post_id 
    AND posts.author_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_post_categories_post_id ON public.post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON public.post_categories(category_id);