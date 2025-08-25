-- Add Max Tegmark to featured thinkers
INSERT INTO public.featured_thinkers (name, bio, field_of_expertise, website_url, display_order, key_works)
VALUES (
  'Max Tegmark',
  'Physicist and cosmologist at MIT, co-founder of the Future of Life Institute. Known for his mathematical universe hypothesis and research on parallel universes and AI safety.',
  'Physics, Cosmology & AI Safety',
  'https://space.mit.edu/home/tegmark/',
  10,
  ARRAY['Our Mathematical Universe', 'Life 3.0: Being Human in the Age of Artificial Intelligence']
);