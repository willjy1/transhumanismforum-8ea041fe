-- First, clear existing categories and update them to match the concepts from Library page
DELETE FROM categories;

-- Insert the correct categories that match the concepts page
INSERT INTO categories (name, color, description) VALUES
  ('Artificial General Intelligence', '#3b82f6', 'Development of AI systems that match or exceed human cognitive abilities'),
  ('Longevity Escape Velocity', '#10b981', 'The theoretical point where life expectancy increases faster than time passes'),
  ('Technological Singularity', '#8b5cf6', 'The hypothetical future point of technological growth beyond human prediction'),
  ('Morphological Freedom', '#f59e0b', 'The right to modify one''s physical and mental capabilities'),
  ('Mind Uploading', '#ec4899', 'The theoretical transfer of human consciousness to digital substrates'),
  ('Cryonics', '#06b6d4', 'Preservation of legally dead people at low temperatures for future revival'),
  ('Friendly AI', '#22c55e', 'AI systems designed to be beneficial and aligned with human values'),
  ('Nootropics', '#eab308', 'Substances that enhance cognitive function, memory, or learning'),
  ('Posthumanism', '#ef4444', 'Philosophy exploring transcendence of traditional human limitations'),
  ('Transhumanism', '#8b5cf6', 'Movement advocating for human enhancement through technology'),
  ('Human Enhancement', '#10b981', 'Use of technology to improve human physical and mental capabilities'),
  ('Life Extension', '#84cc16', 'Scientific efforts to slow, stop, or reverse aging processes'),
  ('Consciousness Research', '#a855f7', 'Scientific study of consciousness, awareness, and subjective experience'),
  ('Bioethics', '#ef4444', 'Ethical implications of biological and medical research and applications'),
  ('Cybernetics', '#8b5cf6', 'Study of communication and control in biological and artificial systems');