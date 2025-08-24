import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight } from 'lucide-react';
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
    <article className="group border-b border-border py-12 hover-lift crisp-transition last:border-b-0">
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Vote column */}
        {user && (
          <div className="col-span-1 flex flex-col items-center gap-1">
            <button
              onClick={() => onVote(post.id, 1)}
              className="text-muted-foreground hover:text-foreground crisp-transition hover:scale-110 text-sm"
            >
              ▲
            </button>
            <span className="text-sm font-mono tabular-nums text-muted-foreground">
              {post.votes_score}
            </span>
            <button
              onClick={() => onVote(post.id, -1)}
              className="text-muted-foreground hover:text-foreground crisp-transition hover:scale-110 text-sm"
            >
              ▼
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={user ? "col-span-11" : "col-span-12"}>
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Link 
                  to={`/posts/${post.id}`}
                  className="block"
                >
                  <h2 className="text-large font-medium leading-tight group-hover:text-accent crisp-transition">
                    {post.title}
                  </h2>
                </Link>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono">
                  <span>
                    {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                  </span>
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                  {post.categories && (
                    <>
                      <span>·</span>
                      <span className="text-accent">
                        {post.categories.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content preview */}
            <p className="text-muted-foreground leading-relaxed">
              {truncateContent(post.content)}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono">
                <span>{post.comment_count} replies</span>
                <span>{post.view_count} views</span>
              </div>
              
              <Link 
                to={`/posts/${post.id}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground crisp-transition group/link"
              >
                <span>Read</span>
                <ArrowUpRight className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 crisp-transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CleanPostCard;