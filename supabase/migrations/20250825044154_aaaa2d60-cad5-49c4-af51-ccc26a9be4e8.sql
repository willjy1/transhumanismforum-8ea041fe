-- Add Zoltan Istvan to featured thinkers
INSERT INTO public.featured_thinkers (
  name,
  bio,
  field_of_expertise,
  key_works,
  website_url,
  display_order
) VALUES (
  'Zoltan Istvan',
  'American futurist, journalist, and political activist known for founding the Transhumanist Party and running for President in 2016 and California Governor in 2018. He advocates for life extension, artificial intelligence development, and morphological freedom.',
  'Transhumanist Politics & Advocacy',
  ARRAY['The Transhumanist Wager', 'Transhumanist Party Platform', 'The Telescope in the Ice'],
  'https://www.zoltanistvan.com',
  10
);