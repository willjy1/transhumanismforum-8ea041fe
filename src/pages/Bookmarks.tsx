import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';

interface BookmarkedPost {
  id: string;
  created_at: string;
  post_id: string;
  posts: {
    id: string;
    title: string;
    content: string;
    votes_score: number;
    view_count: number;
    created_at: string;
    categories: { name: string; color: string } | null;
    profiles: { username: string; full_name: string | null } | null;
  };
}

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          posts(
            id,
            title,
            content,
            votes_score,
            view_count,
            created_at,
            categories(name, color),
            profiles(username, full_name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add comment counts
      const bookmarksWithComments = await Promise.all(
        (data || []).map(async (bookmark) => {
          if (!bookmark.posts) return bookmark;

          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', bookmark.posts.id);

          return {
            ...bookmark,
            posts: {
              ...bookmark.posts,
              comment_count: count || 0
            }
          };
        })
      );

      setBookmarks(bookmarksWithComments);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    // Handle voting - would integrate with existing vote logic
    console.log('Vote on bookmarked post:', postId, voteType);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="flex-1 max-w-4xl">
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <button 
                onClick={() => navigate('/forum')}
                className="flex items-center text-muted-foreground hover:text-foreground mb-6 crisp-transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <Bookmark className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-light tracking-tight">
                  Your Bookmarks
                </h1>
              </div>
              <p className="text-muted-foreground">
                Posts and discussions you've saved for later
              </p>
            </div>

            {/* Bookmarks List */}
            <div className="space-y-4">
              {bookmarks.length > 0 ? (
                bookmarks
                  .filter(bookmark => bookmark.posts) // Filter out null posts
                  .map((bookmark) => (
                    <PostCard
                      key={bookmark.id}
                      post={bookmark.posts as any}
                      onVote={handleVote}
                    />
                  ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start bookmarking posts to save them for later reading
                    </p>
                    <Button asChild>
                      <Link to="/forum">Browse Forum</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;