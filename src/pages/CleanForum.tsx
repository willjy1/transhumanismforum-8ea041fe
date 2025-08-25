import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import CleanPostCard from '@/components/CleanPostCard';

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
  category_id: string | null;
  profiles?: {
    username: string;
    full_name: string;
  };
  categories?: {
    name: string;
    color: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const CleanForum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
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
          *,
          profiles:profiles!posts_author_id_fkey (
            username,
            full_name
          )
        `);

      if (selectedCategory !== 'all') {
        // Using junction table approach for categories
        const { data: filteredPostIds } = await supabase
          .from('post_categories')
          .select('post_id')
          .eq('category_id', selectedCategory);
        
        if (filteredPostIds && filteredPostIds.length > 0) {
          query = query.in('id', filteredPostIds.map(item => item.post_id));
        } else {
          // No posts found with selected category
          setPosts([]);
          setLoading(false);
          return;
        }
      }

      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('votes_score', { ascending: false });
          break;
        case 'discussed':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch categories for each post
      const postsWithCategories = await Promise.all(
        (data || []).map(async (post) => {
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

          return {
            ...post,
            categories: categoriesData
          };
        })
      );

      const sortedData = postsWithCategories.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return 0;
      });

      setPosts(sortedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    searchTerm === '' || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-12 py-20">
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b border-border pb-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
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
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-12">
            
            {/* Minimal Header */}
            <div className="space-y-3 mb-20">
              <h1 className="text-large font-light">
                Discussion Forum
              </h1>
            </div>

            {/* Minimal Controls */}
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-8">
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                
                {/* Category */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 border-0 border-b border-border rounded-none bg-transparent focus:ring-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <div className="flex items-center gap-1 text-sm">
                  {(['recent', 'popular', 'discussed'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 py-1 capitalize crisp-transition ${
                        sortBy === sort 
                          ? 'text-foreground border-b border-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Post */}
              {user && (
                <Link to="/create-post">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </Link>
              )}
            </div>

            {/* Posts */}
            <div className="space-y-12">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CleanPostCard post={post} />
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-muted-foreground">
                      No posts found
                    </h3>
                    {searchTerm && (
                      <p className="text-muted-foreground">
                        No posts match "${searchTerm}".
                      </p>
                    )}
                    {user && !searchTerm && (
                      <Link to="/create-post" className="inline-block mt-6">
                        <Button>Start Discussion</Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanForum;