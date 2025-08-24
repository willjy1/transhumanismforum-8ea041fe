import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
import CleanPostCard from '@/components/CleanPostCard';
import CleanFilters from '@/components/CleanFilters';

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

const CleanForum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'recent' | 'top' | 'hot' | 'new'>('recent');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

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

      // Apply sorting based on active filter
      switch (activeFilter) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'top':
          query = query.order('votes_score', { ascending: false });
          break;
        case 'hot':
          query = query.order('votes_score', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'new':
          query = query.order('created_at', { ascending: false });
          break;
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
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto p-6">
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse elegant-shadow"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        
        <main className="flex-1">
          <CleanFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="animate-fade-in">
                  <CleanPostCard
                    post={post}
                    onVote={vote}
                  />
                </div>
              ))
            ) : (
              <Card className="elegant-shadow">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-3">No posts yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Be the first to start a meaningful discussion about transhumanism and the future of humanity.
                  </p>
                  {user && (
                    <Button asChild className="bg-primary hover:bg-primary/90 shadow-glow">
                      <Link to="/create-post">Create the First Post</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CleanForum;