import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VoteButtonsProps {
  postId?: string;
  commentId?: string;
  initialScore: number;
  className?: string;
}

const VoteButtons = ({ postId, commentId, initialScore, className = '' }: VoteButtonsProps) => {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserVote();
    }
  }, [user, postId, commentId]);

  const fetchUserVote = async () => {
    if (!user) return;

    try {
      const query = supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user.id);

      if (postId) {
        query.eq('post_id', postId);
      } else if (commentId) {
        query.eq('comment_id', commentId);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserVote(data?.vote_type || null);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    if (isVoting) return;

    setIsVoting(true);

    try {
      const isRemovingVote = userVote === voteType;
      
      if (isRemovingVote) {
        // Remove vote
        const deleteQuery = supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id);

        if (postId) {
          deleteQuery.eq('post_id', postId);
        } else if (commentId) {
          deleteQuery.eq('comment_id', commentId);
        }

        const { error } = await deleteQuery;
        if (error) throw error;

        setScore(score - voteType);
        setUserVote(null);
      } else {
        // Add or update vote
        const voteData: any = {
          user_id: user.id,
          vote_type: voteType,
        };

        if (postId) {
          voteData.post_id = postId;
        } else if (commentId) {
          voteData.comment_id = commentId;
        }

        if (userVote !== null) {
          // Update existing vote
          const updateQuery = supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('user_id', user.id);

          if (postId) {
            updateQuery.eq('post_id', postId);
          } else if (commentId) {
            updateQuery.eq('comment_id', commentId);
          }

          const { error } = await updateQuery;
          if (error) throw error;

          setScore(score - userVote + voteType);
        } else {
          // Insert new vote
          const { error } = await supabase
            .from('votes')
            .insert(voteData);

          if (error) throw error;

          setScore(score + voteType);
        }

        setUserVote(voteType);
      }

      // Update post/comment score
      if (postId) {
        await supabase
          .from('posts')
          .update({ votes_score: score + (isRemovingVote ? -voteType : voteType - (userVote || 0)) })
          .eq('id', postId);
      } else if (commentId) {
        await supabase
          .from('comments')
          .update({ votes_score: score + (isRemovingVote ? -voteType : voteType - (userVote || 0)) })
          .eq('id', commentId);
      }

    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error voting",
        description: error.message || "Failed to cast vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1 h-8 w-8 ${
          userVote === 1 
            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
            : 'text-muted-foreground hover:text-green-600'
        }`}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <span className={`text-sm font-medium px-1 ${
        score > 0 ? 'text-green-600' : 
        score < 0 ? 'text-red-600' : 
        'text-muted-foreground'
      }`}>
        {score}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1 h-8 w-8 ${
          userVote === -1 
            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-muted-foreground hover:text-red-600'
        }`}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoteButtons;