import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, User, Hash, Pin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import VoteButtons from './VoteButtons';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  votes_score: number;
  view_count: number;
  is_pinned: boolean;
  category_id: string | null;
  profiles?: {
    username: string;
    full_name: string;
  };
  categories?: {
    name: string;
    color: string;
  };
}

interface PostCardProps {
  post: Post;
  commentCount?: number;
}

const CleanPostCard = ({ post, commentCount = 0 }: PostCardProps) => {
  const [localCommentCount, setLocalCommentCount] = useState(commentCount);

  useEffect(() => {
    if (commentCount === 0) {
      fetchCommentCount();
    }
  }, [post.id, commentCount]);

  const fetchCommentCount = async () => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', post.id);

      if (error) throw error;
      setLocalCommentCount(count || 0);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  };

  return (
    <Card className="group border-border hover:border-accent/50 crisp-transition">
      <CardContent className="p-0">
        <div className="flex gap-4 p-6">
          {/* Vote buttons */}
          <VoteButtons 
            postId={post.id} 
            initialScore={post.votes_score || 0}
            className="pt-1"
          />
          
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header with category and pinned status */}
            <div className="flex items-center gap-3 flex-wrap">
              {post.is_pinned && (
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              
              {post.categories && (
                <Badge 
                  variant="outline" 
                  className="border-opacity-50"
                  style={{ 
                    borderColor: post.categories.color,
                    color: post.categories.color,
                    backgroundColor: `${post.categories.color}10`
                  }}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {post.categories.name}
                </Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <Link 
                to={`/forum/post/${post.id}`}
                className="block group-hover:text-accent crisp-transition"
              >
                <h2 className="text-xl font-medium leading-tight line-clamp-2">
                  {post.title}
                </h2>
              </Link>
            </div>

            {/* Content preview */}
            <div className="text-muted-foreground leading-relaxed">
              <p className="line-clamp-3">
                {getExcerpt(post.content)}
              </p>
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <Link 
                    to={`/profile/${post.profiles?.username || 'unknown'}`}
                    className="hover:text-accent crisp-transition"
                  >
                    {post.profiles?.full_name || post.profiles?.username || 'Unknown User'}
                  </Link>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <time dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{localCommentCount} {localCommentCount === 1 ? 'comment' : 'comments'}</span>
                </div>
                
                <div className="text-xs">
                  {post.view_count || 0} views
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleanPostCard;