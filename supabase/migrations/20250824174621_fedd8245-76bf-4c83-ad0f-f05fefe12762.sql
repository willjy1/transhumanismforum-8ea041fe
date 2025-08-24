-- Remove quotes column from featured_thinkers table since they're not accurate
ALTER TABLE public.featured_thinkers DROP COLUMN IF EXISTS quotes;

-- Add Andres Gomez Emilsson as a featured thinker
INSERT INTO public.featured_thinkers (
  name, 
  bio, 
  field_of_expertise, 
  key_works, 
  website_url,
  display_order
) VALUES (
  'Andres Gomez Emilsson',
  'Founder of the Stanford Transhumanist Association and researcher in consciousness, psychedelics, and computational approaches to suffering reduction. Pioneer in the field of computational phenomenology and advocate for evidence-based approaches to wellbeing enhancement.',
  'Consciousness Research & Computational Phenomenology',
  ARRAY['The Symmetry Theory of Valence', 'Principia Qualia', 'Research on Psychedelics and Consciousness'],
  'https://qri.org/',
  1
) ON CONFLICT DO NOTHING;