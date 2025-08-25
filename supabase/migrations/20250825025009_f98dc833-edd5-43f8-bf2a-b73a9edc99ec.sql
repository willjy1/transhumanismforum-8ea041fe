-- Create function to send notification for note replies
CREATE OR REPLACE FUNCTION public.notify_note_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  parent_author_id uuid;
  parent_author_username text;
  reply_author_username text;
BEGIN
  -- Get the parent note's author
  SELECT author_id INTO parent_author_id
  FROM public.notes 
  WHERE id = NEW.parent_id;
  
  -- Don't notify if replying to own note
  IF parent_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;
  
  -- Get usernames for the notification
  SELECT username INTO parent_author_username
  FROM public.profiles 
  WHERE id = parent_author_id;
  
  SELECT username INTO reply_author_username
  FROM public.profiles 
  WHERE id = NEW.author_id;
  
  -- Create notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    related_user_id,
    related_comment_id
  ) VALUES (
    parent_author_id,
    'note_reply',
    'New reply to your note',
    reply_author_username || ' replied to your note',
    NEW.author_id,
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for note replies
CREATE TRIGGER on_note_reply_created
  AFTER INSERT ON public.notes
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION public.notify_note_reply();

-- Create function to send notification for post comments
CREATE OR REPLACE FUNCTION public.notify_post_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  post_author_id uuid;
  post_title text;
  comment_author_username text;
BEGIN
  -- Get the post's author and title
  SELECT author_id, title INTO post_author_id, post_title
  FROM public.posts 
  WHERE id = NEW.post_id;
  
  -- Don't notify if commenting on own post
  IF post_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;
  
  -- Get username for the notification
  SELECT username INTO comment_author_username
  FROM public.profiles 
  WHERE id = NEW.author_id;
  
  -- Create notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    related_user_id,
    related_post_id,
    related_comment_id
  ) VALUES (
    post_author_id,
    'post_comment',
    'New comment on your post',
    comment_author_username || ' commented on "' || left(post_title, 50) || '"',
    NEW.author_id,
    NEW.post_id,
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for post comments
CREATE TRIGGER on_post_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION public.notify_post_comment();