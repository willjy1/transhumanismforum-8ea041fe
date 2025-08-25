import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string | null;
  } | null;
}

const Index = () => {
  const { loading, user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentPosts();
    }
  }, [user]);

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          profiles!posts_author_id_fkey (
            username
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setRecentPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b border-foreground/20"></div>
      </div>
    );
  }

  if (!user) {
    // Show welcome page for non-authenticated users
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-screen">
          <Sidebar />
          
          <div className="flex-1 relative">
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
              <div className="max-w-2xl mx-auto text-center">
                {/* Main title */}
                <h1 className="font-display text-4xl md:text-6xl font-medium mb-8 tracking-tight text-foreground leading-tight">
                  The Transhumanism Forum
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Join the conversation about humanity's future
                </p>
                <Button asChild size="lg">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-medium mb-4 text-foreground">
                Welcome to The Transhumanism Forum
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Create Post</h3>
                  <p className="text-sm text-muted-foreground mb-4">Share your thoughts with the community</p>
                  <Button asChild size="sm">
                    <Link to="/create-post">Create</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Browse Posts</h3>
                  <p className="text-sm text-muted-foreground mb-4">Explore community discussions</p>
                  <Button asChild size="sm">
                    <Link to="/forum">Browse</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Create Note</h3>
                  <p className="text-sm text-muted-foreground mb-4">Share quick thoughts and observations</p>
                  <Button asChild size="sm">
                    <Link to="/notes">Create Note</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="border-l-2 border-primary/20 pl-4">
                        <Link 
                          to={`/post/${post.id}`}
                          className="block hover:bg-accent/50 rounded p-2 -m-2 transition-colors"
                        >
                          <h4 className="font-medium text-foreground hover:text-primary">
                            {post.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            by {post.profiles?.username || 'Anonymous'} • {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </Link>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/forum">View All Posts <ArrowRight className="h-4 w-4 ml-1" /></Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Button asChild>
                      <Link to="/create-post">Create First Post</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;