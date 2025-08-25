-- Update Max More's current position
UPDATE public.featured_thinkers 
SET bio = 'Philosopher and futurist, founder of the Extropy Institute and current Director at Biostasis Technologies. Former CEO of Alcor Life Extension Foundation.'
WHERE name = 'Max More';

-- Update Anders Sandberg's current position  
UPDATE public.featured_thinkers 
SET bio = 'Computational cognitive scientist and researcher at the Institute for Futures Studies. Expert in enhancement ethics, existential risk, and the future of intelligence.'
WHERE name = 'Anders Sandberg';

-- Remove nationality mention from Nick Bostrom
UPDATE public.featured_thinkers 
SET bio = 'Philosopher known for his work on existential risk, the anthropic principle, human enhancement ethics, and machine intelligence.'
WHERE name = 'Nick Bostrom';

-- Add Aubrey de Grey
INSERT INTO public.featured_thinkers (name, bio, field_of_expertise, website_url, display_order)
VALUES (
  'Aubrey de Grey',
  'Biomedical gerontologist and Chief Science Officer at LEV Foundation. Pioneer in longevity research and developer of the SENS approach to aging.',
  'Longevity Research & Biogerontology',
  'https://www.sens.org',
  9
);