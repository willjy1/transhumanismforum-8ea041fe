import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight, Clock } from 'lucide-react';
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

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <article className="group border-b border-border/30 pb-8 last:border-b-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Link 
              to={`/posts/${post.id}`}
              className="block group-hover:text-primary smooth-transition"
            >
              <h2 className="text-xl font-medium tracking-tight leading-tight">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-light">
                {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
              </span>
              <span>·</span>
              <span className="font-light">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              {post.categories && (
                <>
                  <span>·</span>
                  <span className="font-light">
                    {post.categories.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {user && (
            <div className="flex flex-col items-center gap-1 ml-6">
              <button
                onClick={() => onVote(post.id, 1)}
                className="text-muted-foreground hover:text-foreground smooth-transition text-xs font-light"
              >
                ▲
              </button>
              
              <span className="text-xs font-light text-muted-foreground">
                {post.votes_score}
              </span>
              
              <button
                onClick={() => onVote(post.id, -1)}
                className="text-muted-foreground hover:text-foreground smooth-transition text-xs font-light"
              >
                ▼
              </button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <p className="text-muted-foreground/80 font-light leading-relaxed">
          {truncateContent(post.content)}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
            <span>{post.comment_count} comments</span>
            <span>{post.view_count} views</span>
          </div>
          
          <Link 
            to={`/posts/${post.id}`}
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground smooth-transition font-light group/link"
          >
            <span>Read more</span>
            <ArrowUpRight className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 smooth-transition" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CleanPostCard;