import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
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
  };
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
          ),
          categories (
            name,
            color
          )
        `);

      // Filter by category
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('votes_score', { ascending: false });
          break;
        case 'discussed':
          // Note: This would need a comment count calculation in production
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Sort pinned posts to top
      const sortedData = (data || []).sort((a, b) => {
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
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-16">
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-6">
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-light tracking-tight mb-2">
                    Discussion Forum
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Rigorous discourse on the future of human enhancement
                  </p>
                </div>
                
                {user && (
                  <Link to="/create-post">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Post
                    </Button>
                  </Link>
                )}
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recent
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Popular
                        </div>
                      </SelectItem>
                      <SelectItem value="discussed">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Discussed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    style={selectedCategory === category.id ? {
                      backgroundColor: category.color,
                      borderColor: category.color
                    } : {
                      borderColor: category.color,
                      color: category.color
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <CleanPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-light text-muted-foreground mb-2">
                    {searchTerm ? 'No posts found' : 'No discussions yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? `No posts match "${searchTerm}"`
                      : 'Be the first to start a discussion'
                    }
                  </p>
                  {user && !searchTerm && (
                    <Link to="/create-post">
                      <Button>Create First Post</Button>
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