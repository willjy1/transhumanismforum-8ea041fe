-- Shorten Andres Gomez Emilsson's bio to match the length of other thinkers
UPDATE featured_thinkers 
SET bio = 'Founder of the Stanford Transhumanist Association, researcher in consciousness, psychedelics, and computational approaches to suffering reduction.'
WHERE name = 'Andres Gomez Emilsson';