import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import PostCard from '@/components/PostCard';
import PostSearch from '@/components/PostSearch';
import QuickTakes from '@/components/QuickTakes';
import ActivityFeed from '@/components/ActivityFeed';
import Sidebar from '@/components/Sidebar';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  votes_score: number;
  view_count: number;
  created_at: string;
  categories: { name: string; color: string } | null;
  profiles: { username: string; full_name: string | null } | null;
  comment_count: number;
}

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const { user } = useAuth();
  const { logActivity } = useActivityFeed();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [sortBy, searchQuery, selectedCategories, timeFilter]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          votes_score,
          view_count,
          created_at,
          categories (name, color),
          profiles (username, full_name)
        `);

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      // Apply category filters
      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories);
      }

      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        let timeThreshold: Date;
        
        switch (timeFilter) {
          case 'day':
            timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            timeThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            timeThreshold = new Date(0);
        }
        
        query = query.gte('created_at', timeThreshold.toISOString());
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'top':
          query = query.order('votes_score', { ascending: false });
          break;
        case 'discussed':
          // We'll sort by comment count after fetching
          query = query.order('created_at', { ascending: false });
          break;
        case 'views':
          query = query.order('view_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      const postsWithCommentCount = await Promise.all(
        (data || []).map(async (post) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);
          
          return {
            ...post,
            comment_count: count || 0
          };
        })
      );

      // Sort by comment count if needed
      if (sortBy === 'discussed') {
        postsWithCommentCount.sort((a, b) => b.comment_count - a.comment_count);
      }

      setPosts(postsWithCommentCount);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    if (!user) return;

    try {
      // Log vote activity
      await logActivity('vote_cast', 'post', postId, {
        vote_type: voteType,
        target_type: 'post'
      });

      fetchPosts(); // Refresh posts to get updated scores
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="flex-1 max-w-4xl">
            <div className="animate-pulse space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Posts Column */}
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            <PostSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>
          
          <div className="px-6 pb-6 space-y-4">
            <QuickTakes />
            
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onVote={handleVote}
              />
            ))}

            {posts.length === 0 && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategories.length > 0
                      ? "Try adjusting your search terms or filters"
                      : "Be the first to start a discussion about transhumanism!"
                    }
                  </p>
                  {user && !searchQuery && selectedCategories.length === 0 && (
                    <Button asChild>
                      <Link to="/create-post-rich">Create First Post</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar - Activity Feed */}
        <div className="w-96 border-l bg-card/50 p-6 hidden xl:block">
          <div className="space-y-6">
            <ActivityFeed 
              title="Community Activity"
              limit={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;