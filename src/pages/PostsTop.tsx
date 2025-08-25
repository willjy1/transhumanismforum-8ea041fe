import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: string;
  title: string;
  content: string;
  votes_score: number;
  view_count: number;
  created_at: string;
  categories: { name: string; color: string }[];
  profiles: { username: string; full_name: string | null } | null;
  comment_count: number;
}

const PostsTop = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { logActivity } = useActivityFeed();

  useEffect(() => {
    fetchTopPosts();
  }, []);

  const fetchTopPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          votes_score,
          view_count,
          created_at,
          profiles (username, full_name)
        `)
        .order('votes_score', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch categories for each post
      const postsWithCategories = await Promise.all(
        (posts || []).map(async (post) => {
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select('category_id')
            .eq('post_id', post.id);

          const categoryIds = postCategories?.map(pc => pc.category_id) || [];
          
          let categoriesData = [];
          if (categoryIds.length > 0) {
            const { data: categoriesInfo } = await supabase
              .from('categories')
              .select('name, color')
              .in('id', categoryIds);
            categoriesData = categoriesInfo || [];
          }

          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return {
            ...post,
            categories: categoriesData,
            comment_count: count || 0
          };
        })
      );

      setPosts(postsWithCategories);
    } catch (error) {
      console.error('Error fetching top posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    if (!user) return;

    try {
      await logActivity('vote_cast', 'post', postId, {
        vote_type: voteType,
        target_type: 'post'
      });
      fetchTopPosts(); // Refresh posts
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
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            
            <div className="space-y-3 mb-8">
              <h1 className="text-large font-light">
                Top Posts
              </h1>
            </div>
            
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                />
              ))}

              {posts.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-light text-muted-foreground">
                    No posts found
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsTop;