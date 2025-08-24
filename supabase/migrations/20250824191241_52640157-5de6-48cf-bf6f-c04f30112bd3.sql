-- Add foreign key relationship between user_activity and profiles
ALTER TABLE user_activity 
ADD CONSTRAINT fk_user_activity_profiles 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;