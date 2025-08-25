-- Update posts table to support multiple categories
ALTER TABLE public.posts 
DROP COLUMN category_id;

ALTER TABLE public.posts 
ADD COLUMN category_ids UUID[] DEFAULT '{}';

-- Create index for better performance on category queries
CREATE INDEX idx_posts_category_ids ON public.posts USING GIN(category_ids);

-- Update posts to handle the new array structure
COMMENT ON COLUMN public.posts.category_ids IS 'Array of category IDs that this post belongs to';