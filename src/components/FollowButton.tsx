import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  className,
  size = 'default',
  variant = 'default'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId && user.id !== targetUserId) {
      checkFollowStatus();
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive"
      });
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Can't follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user"
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        if (error) throw error;

        setIsFollowing(true);
        
        // Create notification for the followed user
        await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            type: 'follow',
            title: 'New follower',
            content: `You have a new follower`,
            related_user_id: user.id
          });

        toast({
          title: "Following",
          description: "You are now following this user"
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFollow}
      disabled={loading}
      className={cn("gap-2", className)}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;