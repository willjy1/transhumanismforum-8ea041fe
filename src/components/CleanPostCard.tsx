import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <div className="flex gap-4">
        {/* Karma */}
        {user && (
          <div className="flex flex-col items-center w-10 pt-1">
            <button
              onClick={() => onVote(post.id, 1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronUp className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
            <div className="text-sm font-medium text-gray-700 py-1">
              {post.votes_score}
            </div>
            <button
              onClick={() => onVote(post.id, -1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link to={`/post/${post.id}`} className="group">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
              {post.title}
            </h3>
          </Link>

          {/* Content Preview */}
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {truncateContent(post.content)}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{post.profiles?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{post.comment_count}</span>
            </div>
            {post.categories && (
              <>
                <span>•</span>
                <span className="text-blue-600">{post.categories.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanPostCard;