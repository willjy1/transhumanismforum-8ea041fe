import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EnhancedVoteButtonsProps {
  postId?: string;
  commentId?: string;
  initialScore: number;
  onVoteChange?: (newScore: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
}

const EnhancedVoteButtons: React.FC<EnhancedVoteButtonsProps> = ({
  postId,
  commentId,
  initialScore,
  onVoteChange,
  className,
  size = 'md',
  layout = 'vertical'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (postId || commentId)) {
      checkUserVote();
    }
  }, [user, postId, commentId]);

  const checkUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .maybeSingle();

      if (error) throw error;
      setUserVote(data?.vote_type || null);
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const targetId = postId || commentId;
      const targetColumn = postId ? 'post_id' : 'comment_id';
      
      if (userVote === voteType) {
        // Remove existing vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq(targetColumn, targetId);

        if (error) throw error;

        const newScore = score - voteType;
        setScore(newScore);
        setUserVote(null);
        onVoteChange?.(newScore);

        // Update the score in the target table
        const { error: updateError } = await supabase
          .from(postId ? 'posts' : 'comments')
          .update({ votes_score: newScore })
          .eq('id', targetId);

        if (updateError) throw updateError;
      } else {
        // Remove existing vote if any
        if (userVote !== null) {
          await supabase
            .from('votes')
            .delete()
            .eq('user_id', user.id)
            .eq(targetColumn, targetId);
        }

        // Add new vote
        const { error } = await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            [targetColumn]: targetId,
            vote_type: voteType
          });

        if (error) throw error;

        const scoreChange = userVote !== null ? voteType - userVote : voteType;
        const newScore = score + scoreChange;
        setScore(newScore);
        setUserVote(voteType);
        onVoteChange?.(newScore);

        // Update the score in the target table
        const { error: updateError } = await supabase
          .from(postId ? 'posts' : 'comments')
          .update({ votes_score: newScore })
          .eq('id', targetId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error voting",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-6 w-6 p-0',
    md: 'h-8 w-8 p-0',
    lg: 'h-10 w-10 p-0'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (layout === 'horizontal') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote(1)}
          disabled={loading}
          className={cn(
            sizeClasses[size],
            userVote === 1 
              ? "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30" 
              : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          )}
        >
          <ChevronUp className={iconSizes[size]} />
        </Button>
        
        <span className={cn(
          "font-medium tabular-nums min-w-[2ch] text-center",
          textSizes[size],
          score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-muted-foreground'
        )}>
          {score}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote(-1)}
          disabled={loading}
          className={cn(
            sizeClasses[size],
            userVote === -1 
              ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" 
              : "text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          )}
        >
          <ChevronDown className={iconSizes[size]} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={loading}
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          userVote === 1 
            ? "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 scale-110" 
            : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-110"
        )}
      >
        <ChevronUp className={cn(iconSizes[size], "transition-transform")} />
      </Button>
      
      <span className={cn(
        "font-bold tabular-nums min-w-[2ch] text-center transition-colors",
        textSizes[size],
        score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-muted-foreground'
      )}>
        {score}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          userVote === -1 
            ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 scale-110" 
            : "text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110"
        )}
      >
        <ChevronDown className={cn(iconSizes[size], "transition-transform")} />
      </Button>
    </div>
  );
};

export default EnhancedVoteButtons;