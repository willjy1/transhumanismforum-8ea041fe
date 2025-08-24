-- Update Anders Sandberg's bio since Future of Humanity Institute was disbanded
UPDATE featured_thinkers 
SET bio = 'Computational cognitive scientist and researcher in enhancement ethics, existential risk, and the future of intelligence. Former senior researcher at the disbanded Future of Humanity Institute.'
WHERE name = 'Anders Sandberg';