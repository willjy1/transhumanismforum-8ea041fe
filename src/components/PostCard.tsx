import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Eye, Clock, User, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import EnhancedVoteButtons from '@/components/EnhancedVoteButtons';
import BookmarkButton from '@/components/BookmarkButton';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    votes_score: number;
    view_count: number;
    created_at: string;
    categories: { name: string; color: string } | null;
    profiles: { username: string; full_name: string | null } | null;
    comment_count: number;
  };
  onVote: (postId: string, voteType: number) => void;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, compact = false }) => {
  const { user } = useAuth();

  const truncateContent = (content: string, maxLength: number = 180) => {
    // Strip HTML tags for preview
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.slice(0, maxLength) + '...';
  };

  const getReadingTime = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = plainText.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <article className="interactive-card group">
      <div className="flex gap-4">
        {/* Voting Section */}
        {user && (
          <div className="flex flex-col items-center justify-start py-1 min-w-[60px]">
            <EnhancedVoteButtons
              postId={post.id}
              initialScore={post.votes_score}
              onVoteChange={(newScore) => {
                post.votes_score = newScore;
              }}
              size="sm"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {/* Author & Metadata Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Simple Author Avatar */}
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">{getReadingTime(post.content)}</span>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            {post.categories && (
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: post.categories.color + '60',
                  color: post.categories.color,
                  backgroundColor: post.categories.color + '15'
                }}
              >
                {post.categories.name}
              </Badge>
            )}
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`} className="block group/title">
            <h2 className={cn(
              "font-semibold group-hover/title:text-primary transition-colors leading-tight",
              compact ? "text-lg" : "text-xl"
            )}>
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          {!compact && (
            <p className="text-muted-foreground leading-relaxed">
              {truncateContent(post.content, 200)}
            </p>
          )}

          {/* Engagement Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* Comments */}
              <Link 
                to={`/post/${post.id}#comments`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comment_count}</span>
              </Link>
              
              {/* Views */}
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.view_count.toLocaleString()}</span>
              </div>

              {/* Score */}
              {post.votes_score > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <span className="text-sm">▲ {post.votes_score}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {user && <BookmarkButton postId={post.id} />}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;