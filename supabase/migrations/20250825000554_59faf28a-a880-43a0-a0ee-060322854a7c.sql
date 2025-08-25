-- Fix function search path security warnings
DROP FUNCTION IF EXISTS public.check_rate_limit(uuid, text, integer, interval);
DROP FUNCTION IF EXISTS public.validate_content(text);
DROP FUNCTION IF EXISTS public.validate_post_content();

-- Recreate functions with proper search path
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _user_id uuid,
  _action text,
  _limit_count integer,
  _time_window interval
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  action_count integer;
BEGIN
  SELECT COUNT(*) INTO action_count
  FROM public.user_activity
  WHERE user_id = _user_id
    AND action = _action
    AND created_at > (now() - _time_window);
  
  RETURN action_count < _limit_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_content(content text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF LENGTH(content) > 10000 THEN
    RETURN FALSE;
  END IF;
  
  IF content ~* '(buy now|click here|free money|earn \$|viagra|casino)' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_post_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.check_rate_limit(NEW.author_id, 'post_create', 5, interval '1 hour') THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many posts';
  END IF;

  IF NOT public.validate_content(NEW.content) THEN
    RAISE EXCEPTION 'Content validation failed';
  END IF;

  RETURN NEW;
END;
$$;

-- Reapply trigger
DROP TRIGGER IF EXISTS validate_post_trigger ON public.posts;
CREATE TRIGGER validate_post_trigger
  BEFORE INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_post_content();