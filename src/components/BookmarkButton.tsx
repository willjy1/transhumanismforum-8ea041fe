import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  showText?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  postId, 
  className,
  showText = false 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    }
  }, [user, postId]);

  const checkBookmarkStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Post removed from your bookmarks"
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          title: "Post bookmarked",
          description: "Added to your bookmarks"
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      disabled={loading}
      className={cn(
        "gap-1",
        isBookmarked && "text-primary",
        className
      )}
    >
      <Bookmark 
        className={cn(
          "h-4 w-4",
          isBookmarked && "fill-current"
        )} 
      />
      {showText && (
        <span className="text-xs">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </Button>
  );
};

export default BookmarkButton;