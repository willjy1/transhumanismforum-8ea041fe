import React, { useState, useEffect } from 'react';
import { MessageSquare, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import EnhancedVoteButtons from '@/components/EnhancedVoteButtons';
import { SecurityUtils } from '@/lib/security';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  parent_id: string | null;
  post_id: string;
  votes_score: number;
  profiles?: {
    username: string;
    full_name?: string;
  };
}

interface CommentsSectionProps {
  postId: string;
}

const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityFeed();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleVote = async (newScore: number) => {
    // The EnhancedVoteButtons component handles the voting logic
    // We just need to log the activity here
    if (user) {
      await logActivity('vote_cast', 'comment', comment.id, {
        vote_type: newScore > (comment.votes_score || 0) ? 1 : -1,
        target_type: 'comment'
      });
    }
  };

  const handleReply = async () => {
    if (!user || !replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: replyContent.trim(),
          author_id: user.id,
          parent_id: comment.id,
          post_id: comment.post_id
        });

      if (error) throw error;

      // Log reply activity
      await logActivity('comment_created', 'comment', comment.id, {
        parent_comment_id: comment.id,
        post_id: comment.post_id
      });

      setReplyContent('');
      setIsReplying(false);
      toast({
        title: "Reply posted",
        description: "Your reply has been added"
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error posting reply",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const authorName = comment.profiles?.full_name || comment.profiles?.username || 'Unknown';
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l border-border/50 pl-4' : ''}`}>
      <Card className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <EnhancedVoteButtons
            commentId={comment.id}
            initialScore={comment.votes_score || 0}
            onVoteChange={handleVote}
            size="sm"
            layout="vertical"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{authorName}</span>
              <span>•</span>
              <time>{timeAgo}</time>
            </div>

            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: SecurityUtils.sanitizeHtml(comment.content)
              }}
            />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="h-6 px-2 text-xs text-muted-foreground"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>

            {isReplying && (
              <div className="space-y-2 pt-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                  >
                    Post Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityFeed();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          author_id: user.id,
          post_id: postId,
          parent_id: null
        });

      if (error) throw error;

      // Log comment activity
      await logActivity('comment_created', 'post', postId, {
        comment_content: newComment.trim()
      });

      setNewComment('');
      await fetchComments();
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion"
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error posting comment",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const topLevel: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map and add replies array
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id)!);
        }
      } else {
        topLevel.push(commentMap.get(comment.id)!);
      }
    });

    return topLevel;
  };

  const organizedComments = organizeComments(comments);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-lg font-medium">Comments</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-medium">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* New comment form */}
      <Card className="p-4">
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Add to the discussion..." : "Sign in to join the discussion"}
            className="min-h-[100px]"
            disabled={!user}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!user || !newComment.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {organizedComments.length > 0 ? (
          organizedComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentItem comment={comment} />
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={1} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};