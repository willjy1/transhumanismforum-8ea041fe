import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import PostFilters from '@/components/PostFilters';
import QuickTakes from '@/components/QuickTakes';
import Sidebar from '@/components/Sidebar';

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
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'recent' | 'top' | 'hot' | 'new'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'votes_score' | 'view_count'>('created_at');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [activeFilter, sortBy, searchQuery]);

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

      // Apply sorting based on active filter
      switch (activeFilter) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'top':
          query = query.order('votes_score', { ascending: false });
          break;
        case 'hot':
          // Simple hot algorithm - could be more sophisticated
          query = query.order('votes_score', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'new':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order(sortBy, { ascending: false });
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

      setPosts(postsWithCommentCount);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (postId: string, voteType: number) => {
    if (!user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same button
          await supabase
            .from('votes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);
        } else {
          // Update vote if clicking different button
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('post_id', postId)
            .eq('user_id', user.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            post_id: postId,
            user_id: user.id,
            vote_type: voteType
          });
      }

      // Recalculate vote score
      const { data: votes } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('post_id', postId);

      const score = votes?.reduce((sum, vote) => sum + vote.vote_type, 0) || 0;

      await supabase
        .from('posts')
        .update({ votes_score: score })
        .eq('id', postId);

      fetchPosts();
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
          <PostFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          <div className="p-6 space-y-4">
            <QuickTakes />
            
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onVote={vote}
              />
            ))}

            {posts.length === 0 && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search terms or filters"
                      : "Be the first to start a discussion about transhumanism!"
                    }
                  </p>
                  {user && !searchQuery && (
                    <Button asChild>
                      <Link to="/create-post">Create First Post</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar - Future use for trending, recommendations etc. */}
        <div className="w-80 border-l bg-card/50 p-6 hidden xl:block">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Community Stats</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Posts: {posts.length}</div>
                <div>Active discussions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;