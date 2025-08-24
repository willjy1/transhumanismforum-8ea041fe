import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight, Heart, Bookmark, MessageCircle, Share, UserPlus, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface CleanPostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    votes_score: number;
    view_count: number;
    created_at: string;
    author_id: string;
    categories: { name: string; color: string } | null;
    profiles: { username: string; full_name: string | null; avatar_url?: string | null; bio?: string | null } | null;
    comment_count: number;
  };
  onVote: (postId: string, voteType: number) => void;
}

const CleanPostCard: React.FC<CleanPostCardProps> = ({ post, onVote }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user && post.author_id) {
      checkFollowStatus();
    }
  }, [user, post.author_id]);

  const checkFollowStatus = async () => {
    if (!user || !post.author_id) return;
    
    try {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', post.author_id)
        .single();
      
      setIsFollowing(!!data);
    } catch (error) {
      // Not following
    }
  };

  const handleFollow = async () => {
    if (!user || !post.author_id || followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', post.author_id);
        setIsFollowing(false);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: post.author_id
          });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 250) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  const authorName = post.profiles?.full_name || post.profiles?.username || 'Anonymous';
  const canFollow = user && post.author_id && user.id !== post.author_id;

  return (
    <article className="group py-16 border-b border-border/30 last:border-b-0 hover-lift crisp-transition">
      <div className="space-y-8">
        
        {/* Author info - Prominent like Substack */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={`/profile/${post.profiles?.username}`}
              className="flex items-center gap-4 group/author"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover/author:bg-muted/80 crisp-transition">
                {post.profiles?.avatar_url ? (
                  <img 
                    src={post.profiles.avatar_url} 
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-sm">
                    {authorName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium group-hover/author:text-accent crisp-transition">
                  {authorName}
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </Link>
          </div>
          
          {canFollow && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollow}
              disabled={followLoading}
              className="crisp-transition"
            >
              {isFollowing ? (
                <>
                  <Check className="h-3 w-3 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>

        {/* Post content */}
        <div className="space-y-6">
          <Link 
            to={`/posts/${post.id}`}
            className="block group/content"
          >
            <h2 className="text-2xl font-light leading-tight mb-4 group-hover/content:text-accent crisp-transition">
              {post.title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              {truncateContent(post.content)}
            </p>
          </Link>

          {/* Category tag */}
          {post.categories && (
            <div className="inline-block">
              <span className="px-3 py-1 text-xs font-mono bg-muted/50 text-muted-foreground rounded-full border border-border/30">
                {post.categories.name}
              </span>
            </div>
          )}
        </div>

        {/* Social actions - Substack-style */}
        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          <div className="flex items-center gap-6">
            <button 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground crisp-transition group/like"
            >
              <Heart className="h-4 w-4 group-hover/like:scale-110 crisp-transition" />
              <span className="font-mono tabular-nums">{post.votes_score}</span>
            </button>
            
            <Link 
              to={`/posts/${post.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground crisp-transition group/comment"
            >
              <MessageCircle className="h-4 w-4 group-hover/comment:scale-110 crisp-transition" />
              <span className="font-mono tabular-nums">{post.comment_count}</span>
            </Link>
            
            <button 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground crisp-transition group/bookmark"
            >
              <Bookmark className="h-4 w-4 group-hover/bookmark:scale-110 crisp-transition" />
            </button>
            
            <button 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground crisp-transition group/share"
            >
              <Share className="h-4 w-4 group-hover/share:scale-110 crisp-transition" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
            <span>{post.view_count} views</span>
            <Link 
              to={`/posts/${post.id}`}
              className="inline-flex items-center hover:text-foreground crisp-transition group/read"
            >
              <span>Read more</span>
              <ArrowUpRight className="h-3 w-3 ml-1 group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 crisp-transition" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CleanPostCard;