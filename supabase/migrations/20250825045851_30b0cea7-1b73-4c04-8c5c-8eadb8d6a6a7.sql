-- Expand Natasha Vita-More's bio
UPDATE public.featured_thinkers 
SET bio = 'Artist, designer, and transhumanist theorist known for pioneering work in human enhancement design and longevity. Author of "The Transhumanist Reader" and creator of the "Primo Posthuman" whole body design concept for life extension.'
WHERE name = 'Natasha Vita-More';

-- Expand Ray Kurzweil's bio
UPDATE public.featured_thinkers 
SET bio = 'Inventor, futurist, and Director of Engineering at Google. Pioneer in AI, pattern recognition, and technological singularity theory. Author of "The Age of Spiritual Machines" and "The Singularity is Near", predicting exponential technological growth.'
WHERE name = 'Ray Kurzweil';

-- Expand Zoltan Istvan's bio  
UPDATE public.featured_thinkers 
SET bio = 'Journalist, futurist, and transhumanist activist. Former presidential candidate who promoted life extension and human enhancement technologies. Author of "The Transhumanist Wager" and founder of the Transhumanist Party.'
WHERE name = 'Zoltan Istvan';

-- Expand other bios for consistency
UPDATE public.featured_thinkers 
SET bio = 'Roboticist, AI researcher, and entrepreneur. Co-founder of iRobot and former Director of MIT AI Lab. Pioneer in behavior-based robotics and advocate for embodied intelligence in artificial systems.'
WHERE name = 'Rodney Brooks';

UPDATE public.featured_thinkers 
SET bio = 'Cognitive scientist, linguist, and philosopher at Tufts University. Leading expert on consciousness, free will, and philosophy of mind. Author of "Consciousness Explained" and prominent critic of strong AI claims.'
WHERE name = 'Daniel Dennett';