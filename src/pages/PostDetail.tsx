import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Flag, Share, Eye, Calendar, User2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
import { PostVoting } from '@/components/PostVoting';
import { CommentsSection } from '@/components/CommentsSection';
import { formatDistanceToNow } from 'date-fns';

interface PostData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  votes_score: number;
  view_count: number;
  is_pinned: boolean;
  category_id?: string;
  profiles?: {
    username: string;
    full_name?: string;
    bio?: string;
    karma?: number;
  };
  categories?: {
    name: string;
    color: string;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<PostData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
      trackView();
      checkBookmarkStatus();
    }
  }, [id, user]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(username, full_name, bio, karma),
          categories(name, color)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (!id) return;

    try {
      // Record view
      await supabase.from('post_views').insert({
        post_id: id,
        user_id: user?.id || null,
        ip_address: null, // Could be populated server-side
        user_agent: navigator.userAgent
      });

      // Increment view count
      const { data: currentPost } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', id)
        .single();

      if (currentPost) {
        await supabase
          .from('posts')
          .update({ view_count: (currentPost.view_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', id)
        .single();

      setIsBookmarked(!!data);
    } catch (error) {
      // Not bookmarked
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to bookmark posts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id);
        setIsBookmarked(false);
        toast({ title: "Bookmark removed" });
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, post_id: id });
        setIsBookmarked(true);
        toast({ title: "Post bookmarked" });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center py-16">
                <h1 className="text-2xl font-light text-muted-foreground mb-4">
                  {error || 'Post not found'}
                </h1>
                <Button onClick={() => navigate('/forum')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forum
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const authorName = post.profiles?.full_name || post.profiles?.username || 'Unknown';
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <article className="max-w-4xl mx-auto px-6 py-8">
            {/* Navigation */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/forum')}
                className="text-muted-foreground hover:text-foreground -ml-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </Button>
            </div>

            {/* Post Header */}
            <div className="space-y-6 mb-12">
              {/* Category and status */}
              <div className="flex items-center gap-3">
                {post.is_pinned && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    Pinned
                  </Badge>
                )}
                {post.categories && (
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: post.categories.color,
                      color: post.categories.color,
                      backgroundColor: `${post.categories.color}10`
                    }}
                  >
                    {post.categories.name}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-light tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Author and meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link 
                    to={`/profile/${post.profiles?.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium group-hover:text-accent crisp-transition">
                        {authorName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.profiles?.karma || 0} karma
                      </div>
                    </div>
                  </Link>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time>{timeAgo}</time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count || 0} views</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBookmark}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sharePost}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Share className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="flex gap-8 mb-12">
              {/* Voting */}
              <div className="flex-shrink-0">
                <PostVoting 
                  postId={post.id} 
                  initialScore={post.votes_score}
                  className="sticky top-24"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="prose prose-lg prose-neutral max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed text-foreground">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="border-t border-border pt-12">
              <CommentsSection postId={post.id} />
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default PostDetail;