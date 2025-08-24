import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PostVotingProps {
  postId: string;
  initialScore: number;
  className?: string;
}

interface Vote {
  vote_type: number;
}

export const PostVoting = ({ postId, initialScore, className }: PostVotingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserVote();
    }
  }, [user, postId]);

  const fetchUserVote = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setUserVote(data.vote_type);
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to vote",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      // If clicking the same vote, remove it
      if (userVote === voteType) {
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        setScore(score - voteType);
        setUserVote(null);
      } else {
        // Remove existing vote if any, then add new one
        if (userVote !== null) {
          await supabase
            .from('votes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);
          
          setScore(score - userVote);
        }

        const { error } = await supabase
          .from('votes')
          .insert({
            post_id: postId,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;

        setScore(score + voteType);
        setUserVote(voteType);
      }

      // Update post score
      await supabase
        .from('posts')
        .update({ votes_score: score + (userVote === voteType ? -voteType : voteType) })
        .eq('id', postId);

    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error voting",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={isLoading}
        className={`h-8 w-8 p-0 hover:bg-muted/50 ${
          userVote === 1 ? 'text-green-600 bg-green-50 dark:bg-green-950' : 'text-muted-foreground'
        }`}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <span className={`text-sm font-medium ${
        score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-muted-foreground'
      }`}>
        {score}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        className={`h-8 w-8 p-0 hover:bg-muted/50 ${
          userVote === -1 ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-muted-foreground'
        }`}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};