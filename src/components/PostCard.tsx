import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Eye, Clock, TrendingUp, User, Bookmark } from 'lucide-react';
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

  const truncateContent = (content: string, maxLength: number = 200) => {
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
    <article className="engagement-card group hover:scale-[1.01] transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary/60">
      <div className="flex gap-4">
        {/* Enhanced Voting Section */}
        {user && (
          <div className="flex flex-col items-center justify-start py-2 min-w-[70px]">
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
              {/* Author Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm hover:text-primary transition-colors cursor-pointer">
                    {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                  </span>
                  {post.profiles?.username && post.profiles?.full_name && (
                    <span className="text-xs text-muted-foreground">@{post.profiles.username}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  <span>•</span>
                  <span>{getReadingTime(post.content)}</span>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            {post.categories && (
              <Badge 
                variant="outline" 
                className="text-xs font-medium hover:scale-105 transition-transform"
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
              "font-semibold group-hover/title:text-primary transition-colors leading-tight line-clamp-2",
              compact ? "text-lg" : "text-xl"
            )}>
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          {!compact && (
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                {truncateContent(post.content, 250)}
              </p>
              
              <Link 
                to={`/post/${post.id}`}
                className="inline-flex items-center text-primary hover:text-accent transition-colors text-sm font-medium group/read"
              >
                Continue reading
                <TrendingUp className="ml-1 h-3 w-3 group-hover/read:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {/* Engagement Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-6">
              {/* Comments */}
              <Link 
                to={`/post/${post.id}#comments`}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/comment"
              >
                <MessageSquare className="h-4 w-4 group-hover/comment:scale-110 transition-transform" />
                <span className="text-sm font-medium">{post.comment_count}</span>
                <span className="text-xs hidden sm:block">
                  {post.comment_count === 1 ? 'comment' : 'comments'}
                </span>
              </Link>
              
              {/* Views */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{post.view_count.toLocaleString()}</span>
                <span className="text-xs hidden sm:block">views</span>
              </div>

              {/* Score indicator */}
              {post.votes_score > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{post.votes_score}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {user && (
                <BookmarkButton postId={post.id} />
              )}
              
              {/* Share button placeholder */}
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;