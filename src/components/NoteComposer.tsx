import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface NoteComposerProps {
  onNoteCreated: () => void;
  placeholder?: string;
  replyTo?: string | null;
  onCancel?: () => void;
}

const NoteComposer: React.FC<NoteComposerProps> = ({
  onNoteCreated,
  placeholder = "What's on your mind?",
  replyTo = null,
  onCancel
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          content: content.trim(),
          author_id: user.id,
          parent_id: replyTo
        });

      if (error) throw error;

      setContent('');
      onNoteCreated();
      
      if (onCancel) {
        onCancel();
      }

      toast({
        title: "Success",
        description: replyTo ? "Your reply has been posted!" : "Your note has been posted!",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to post note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user.user_metadata?.full_name?.[0] || user.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] resize-none border-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                  {content.length}/500 characters
                </span>
                
                <div className="flex gap-2">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || isSubmitting || content.length > 500}
                    className="min-w-[80px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Posting...
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteComposer;