-- Create a function to send custom signup confirmation emails
CREATE OR REPLACE FUNCTION public.send_confirmation_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be called after user signup
  -- The actual email sending will be handled by an Edge Function
  PERFORM pg_notify('user_signup', json_build_object('user_id', NEW.id, 'email', NEW.email)::text);
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.send_confirmation_email();