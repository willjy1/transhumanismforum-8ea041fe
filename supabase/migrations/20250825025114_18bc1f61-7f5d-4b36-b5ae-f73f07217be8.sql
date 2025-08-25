-- Drop existing trigger and recreate it properly
DROP TRIGGER IF EXISTS on_note_reply_created ON public.notes;
DROP TRIGGER IF EXISTS on_post_comment_created ON public.comments;

-- Recreate the triggers
CREATE TRIGGER on_note_reply_created
  AFTER INSERT ON public.notes
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION public.notify_note_reply();

CREATE TRIGGER on_post_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION public.notify_post_comment();