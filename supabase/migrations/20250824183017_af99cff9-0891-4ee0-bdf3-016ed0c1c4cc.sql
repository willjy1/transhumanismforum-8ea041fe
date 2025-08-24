-- Fix incorrect attribution for Andres Gomez Emilsson
UPDATE featured_thinkers 
SET key_works = ARRAY[
  'The Symmetry Theory of Valence',
  'Research on Psychedelics and Consciousness',
  'Computational Approaches to Suffering Reduction'
]
WHERE name = 'Andres Gomez Emilsson';

-- Add some essential categories for the forum
INSERT INTO categories (name, description, color) VALUES
  ('Human Enhancement', 'Genetic engineering, cybernetics, and biological augmentation', '#10b981'),
  ('AI & Consciousness', 'Artificial intelligence, digital minds, and consciousness research', '#3b82f6'),
  ('Life Extension', 'Longevity research, aging reversal, and life extension technologies', '#8b5cf6'),
  ('Philosophy', 'Transhumanist ethics, existential risk, and philosophical implications', '#f59e0b'),
  ('Technology', 'Emerging technologies and their implications for humanity', '#ef4444')
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  color = EXCLUDED.color;