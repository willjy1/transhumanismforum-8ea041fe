import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, MessageSquare, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CleanPostCardProps {
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
}

const CleanPostCard: React.FC<CleanPostCardProps> = ({ post, onVote }) => {
  const { user } = useAuth();

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <Card className="elegant-shadow hover:shadow-glow smooth-transition group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {post.categories && (
              <Badge 
                variant="secondary" 
                className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {post.categories.name}
              </Badge>
            )}
            
            <Link 
              to={`/posts/${post.id}`}
              className="block group-hover:text-primary smooth-transition"
            >
              <h2 className="text-xl font-semibold leading-tight mb-2 line-clamp-2">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {user && (
            <div className="flex flex-col items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(post.id, 1)}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                {post.votes_score}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(post.id, -1)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground leading-relaxed mb-4">
          {truncateContent(post.content)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comment_count} comments</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.view_count} views</span>
            </div>
          </div>
          
          <Link 
            to={`/posts/${post.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80 smooth-transition"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleanPostCard;