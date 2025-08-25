import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Flag, Share, Eye, Calendar, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PostVoting } from '@/components/PostVoting';
import { CommentsSection } from '@/components/CommentsSection';
import Sidebar from '@/components/Sidebar';
import { formatDistanceToNow } from 'date-fns';

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
  category_id?: string;
  profiles?: {
    username: string;
    full_name?: string;
    bio?: string;
  };
  categories?: {
    name: string;
    color: string;
  }[];
}

interface RelatedPost {
  id: string;
  title: string;
  votes_score: number;
  created_at: string;
  profiles?: {
    username: string;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (id) {
      fetchPost();
      trackView();
    }
  }, [id]);

  useEffect(() => {
    if (user && post) {
      checkBookmarkStatus();
    }
  }, [user, post]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(username, full_name, bio)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch categories separately
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', id);

      const categoryIds = postCategories?.map(pc => pc.category_id) || [];
      
      let categoriesData = [];
      if (categoryIds.length > 0) {
        const { data: categoriesInfo } = await supabase
          .from('categories')
          .select('name, color')
          .in('id', categoryIds);
        categoriesData = categoriesInfo || [];
      }

      setPost({
        ...data,
        categories: categoriesData
      });

      // Update view count
      await supabase
        .from('posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error loading post",
        description: "The post could not be found.",
        variant: "destructive"
      });
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (!user) return;

    try {
      await supabase
        .from('post_views')
        .insert({
          post_id: id,
          user_id: user.id,
          ip_address: null,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      // Ignore errors for view tracking
    }
  };

  const fetchRelatedPosts = async () => {
    if (!post) return;

    try {
      let query = supabase
        .from('posts')
        .select('id, title, votes_score, created_at, profiles(username)')
        .neq('id', id)
        .order('votes_score', { ascending: false })
        .limit(5);

      if (post.category_id) {
        query = query.eq('category_id', post.category_id);
      }

      const { data } = await query;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!user || !post) return;

    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', post.id)
        .maybeSingle();

      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
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
          .eq('post_id', post!.id);
        
        setIsBookmarked(false);
        toast({ title: "Bookmark removed" });
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            post_id: post!.id
          });
        
        setIsBookmarked(true);
        toast({ title: "Post bookmarked" });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Could not update bookmark",
        variant: "destructive"
      });
    }
  };

  const sharePost = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: `Check out this discussion: ${post?.title}`,
          url
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Link copied to clipboard" });
    } catch (error) {
      toast({
        title: "Could not copy link",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-12 text-center">
            <h1 className="text-2xl font-light mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/forum')}>Back to Forum</Button>
          </div>
        </main>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const authorName = post.profiles?.full_name || post.profiles?.username || 'Unknown';
  const excerpt = post.content.substring(0, 160) + '...';

  return (
    <div className="flex min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | Beyond Humanity</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": excerpt,
            "author": {
              "@type": "Person",
              "name": authorName
            },
            "datePublished": post.created_at,
            "dateModified": post.updated_at
          })}
        </script>
      </Helmet>

      <Sidebar />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Navigation */}
            <div className="mb-12">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/forum')}
                className="text-muted-foreground hover:text-foreground -ml-3"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </Button>
            </div>

            {/* Post Header */}
            <div className="space-y-12">
              <div className="space-y-8">
                {/* Category and status badges */}
                <div className="flex items-center gap-3">
                  {post.is_pinned && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      Pinned
                    </Badge>
                  )}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-2">
                      {post.categories.map((category, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          style={{ 
                            borderColor: category.color,
                            color: category.color,
                            backgroundColor: `${category.color}15`
                          }}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-5xl font-light leading-tight tracking-tight">
                  {post.title}
                </h1>

                {/* Meta info */}
                <div className="flex items-center justify-between py-8 border-y border-border/30">
                  <div className="flex items-center gap-8">
                    <Link 
                      to={`/profile/${post.profiles?.username}`}
                      className="flex items-center gap-4 hover:text-accent crisp-transition group"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg">
                          {authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-lg font-light group-hover:text-accent crisp-transition">
                          {authorName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{post.profiles?.username}
                        </div>
                      </div>
                    </Link>

                    <div className="text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time>{timeAgo}</time>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.view_count || 0} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <PostVoting 
                      postId={post.id} 
                      initialScore={post.votes_score || 0}
                      className="flex-row gap-4 border border-border/50 rounded-lg px-4 py-2"
                    />
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={toggleBookmark}
                      className="gap-2"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={sharePost}
                      className="gap-2"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-neutral prose-xl max-w-none dark:prose-invert">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-8 leading-relaxed font-light">
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>

              {/* Comments */}
              <div className="pt-16 border-t border-border/30">
                <CommentsSection postId={post.id} />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="pt-16 border-t border-border/30">
                  <h3 className="text-xl font-light mb-8">Related Discussions</h3>
                  <div className="grid gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Card key={relatedPost.id} className="p-6 hover:border-accent/50 crisp-transition">
                        <Link 
                          to={`/post/${relatedPost.id}`}
                          className="block hover:text-accent crisp-transition"
                        >
                          <h4 className="text-lg font-light mb-3 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>{relatedPost.profiles?.username}</span>
                            <span>•</span>
                            <span>{relatedPost.votes_score} points</span>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
    </div>
  );
};

export default PostDetail;