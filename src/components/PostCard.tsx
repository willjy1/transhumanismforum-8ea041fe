import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Eye, Clock } from 'lucide-react';
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
    categories: { name: string; color: string }[];
    profiles: { username: string; full_name: string | null } | null;
    comment_count: number;
  };
  onVote: (postId: string, voteType: number) => void;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, compact = false }) => {
  const { user } = useAuth();

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-2 border-l-transparent hover:border-l-primary/50">
      <CardContent className="p-0">
        <div className="flex">
          {/* Enhanced Voting Section */}
          {user && (
            <div className="flex flex-col items-center justify-start p-4 bg-muted/30 min-w-[60px]">
              <EnhancedVoteButtons
                postId={post.id}
                initialScore={post.votes_score}
                onVoteChange={(newScore) => {
                  // Update the score in parent component if needed
                  post.votes_score = newScore;
                }}
                size="sm"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Category and Metadata */}
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-1">
                  {post.categories.slice(0, 3).map((category, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: category.color + '40',
                        color: category.color,
                        backgroundColor: category.color + '10'
                      }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                  {post.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.categories.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              <span>•</span>
              <span>{post.profiles?.username || 'Anonymous'}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Title */}
            <Link to={`/post/${post.id}`} className="block group">
              <h3 className={cn(
                "font-semibold group-hover:text-primary transition-colors mb-2 leading-tight",
                compact ? "text-base" : "text-lg"
              )}>
                {post.title}
              </h3>
            </Link>

            {/* Content Preview */}
            {!compact && (
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {truncateContent(post.content)}
              </p>
            )}

            {/* Engagement Metrics */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.comment_count} comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.view_count} views</span>
                </div>
              </div>
              
              {user && (
                <BookmarkButton postId={post.id} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;