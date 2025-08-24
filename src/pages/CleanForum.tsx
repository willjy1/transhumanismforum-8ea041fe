import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-2xl mx-auto px-8 py-8">
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-4 pb-8 border-b border-border/30">
                    <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        
        <main className="flex-1">
          <CleanFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <div className="max-w-4xl mx-auto px-12 py-16">
            <div className="space-y-16">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <CleanPostCard
                      post={post}
                      onVote={vote}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-32">
                  <h3 className="text-large font-light text-muted-foreground mb-6">
                    No discussions yet
                  </h3>
                  <p className="text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
                    Start the first meaningful conversation about transhumanism 
                    and the future of humanity.
                  </p>
                  {user && (
                    <Link 
                      to="/create-post"
                      className="group relative inline-flex items-center text-xl font-light hover-lift"
                    >
                      <span className="relative z-10">Create First Post</span>
                      <ArrowUpRight className="h-5 w-5 ml-3 crisp-transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                      <div className="absolute inset-0 -z-10 bg-accent/5 scale-0 group-hover:scale-100 crisp-transition rounded-lg -m-4"></div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CleanForum;