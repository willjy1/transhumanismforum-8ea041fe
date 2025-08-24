import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronUp, ChevronDown, MessageSquare, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-2 border-l-transparent hover:border-l-primary/50">
      <CardContent className="p-0">
        <div className="flex">
          {/* Karma/Voting Section */}
          {user && (
            <div className="flex flex-col items-center justify-start p-4 bg-muted/30 min-w-[60px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(post.id, 1)}
                className="p-1 h-8 w-8 hover:bg-primary/10 hover:text-primary"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="text-sm font-bold text-center py-1 min-w-[2ch]">
                {post.votes_score}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(post.id, -1)}
                className="p-1 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Category and Metadata */}
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              {post.categories && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: post.categories.color + '40',
                    color: post.categories.color,
                    backgroundColor: post.categories.color + '10'
                  }}
                >
                  {post.categories.name}
                </Badge>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;