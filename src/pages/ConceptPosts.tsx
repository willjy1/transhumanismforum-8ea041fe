import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  votes_score: number;
  view_count: number;
  categories: { name: string; color: string }[];
  profiles: { username: string; full_name: string | null } | null;
  comment_count: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const ConceptPosts = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const handleVote = (postId: string, voteType: number) => {
    // Implement vote handling if needed
    console.log('Vote:', postId, voteType);
  };

  useEffect(() => {
    if (conceptId) {
      fetchCategoryAndPosts();
    }
  }, [conceptId]);

  const fetchCategoryAndPosts = async () => {
    try {
      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', conceptId)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Fetch posts in this category
      const { data: postCategoriesData, error: postCategoriesError } = await supabase
        .from('post_categories')
        .select('post_id')
        .eq('category_id', conceptId);

      if (postCategoriesError) throw postCategoriesError;

      if (postCategoriesData && postCategoriesData.length > 0) {
        const postIds = postCategoriesData.map(pc => pc.post_id);
        
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:author_id (
              username,
              full_name
            )
          `)
          .in('id', postIds)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Transform the data to match the expected format
        const transformedPosts = postsData?.map(post => ({
          ...post,
          categories: [{ name: categoryData.name, color: categoryData.color }],
          comment_count: 0 // You might want to add this to your database or calculate it
        })) || [];

        setPosts(transformedPosts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching category posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-16">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-16">
              <p className="text-muted-foreground">Category not found.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Header with back button */}
            <div className="mb-8">
              <Link to="/concepts">
                <Button variant="ghost" className="mb-4 -ml-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Concepts
                </Button>
              </Link>
              <h1 className="text-3xl font-light tracking-tight mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>

            {/* Posts list */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onVote={handleVote} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No posts found for this concept yet.
                  </p>
                  <Link to="/create-post">
                    <Button className="mt-4">
                      Create the first post
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConceptPosts;