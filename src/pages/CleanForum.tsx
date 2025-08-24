import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, Clock, MessageSquare, Users, Eye, ArrowUpRight } from 'lucide-react';
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
            <div className="max-w-5xl mx-auto px-8 py-16">
              <div className="space-y-8">
                {/* Header skeleton */}
                <div className="space-y-4">
                  <div className="h-12 bg-muted rounded-lg w-80 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-96 animate-pulse"></div>
                </div>
                
                {/* Posts skeleton */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="interactive-card">
                    <div className="animate-pulse space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-muted rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-32"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-7 bg-muted rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-6">
                          <div className="h-4 bg-muted rounded w-16"></div>
                          <div className="h-4 bg-muted rounded w-20"></div>
                          <div className="h-4 bg-muted rounded w-18"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
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
        <main className="flex-1 relative">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-subtle border-b border-border/50">
            <div className="max-w-5xl mx-auto px-8 py-16">
              <div className="space-y-8 animate-fade-up">
                
                {/* Title and description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-accent" />
                    <h1 className="text-hero">
                      Discussion Forum
                    </h1>
                  </div>
                  <p className="text-body text-muted-foreground max-w-3xl">
                    Engage in rigorous discourse about consciousness expansion, artificial intelligence, 
                    human enhancement, and the philosophical implications of transcending our biological limitations.
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    <span className="font-medium">{posts.length}</span>
                    <span className="text-muted-foreground">
                      {posts.length === 1 ? 'discussion' : 'discussions'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-medium">Active Community</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-8 py-12">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="text-caption text-muted-foreground">
                  Showing {filteredPosts.length} of {posts.length} discussions
                </div>
              </div>
              
              {user && (
                <Link to="/create-post">
                  <Button size="lg" className="gap-2 px-6 hover-lift">
                    <Plus className="h-4 w-4" />
                    New Discussion
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Enhanced Filters */}
            <div className="space-y-8 mb-12">
              
              {/* Search and primary filters */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Search */}
                <div className="lg:col-span-6 relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions, ideas, concepts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base bg-card border-2 hover:border-accent/30 focus:border-accent smooth-transition"
                  />
                </div>
                
                {/* Category filter */}
                <div className="lg:col-span-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 bg-card border-2 hover:border-accent/30 focus:border-accent">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-3">
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
                </div>
                
                {/* Sort options */}
                <div className="lg:col-span-3">
                  <div className="flex bg-card rounded-lg border-2 p-1">
                    {(['recent', 'popular', 'discussed'] as const).map((sort) => {
                      const icons = {
                        recent: Clock,
                        popular: TrendingUp,
                        discussed: MessageSquare
                      };
                      const Icon = icons[sort];
                      
                      return (
                        <Button
                          key={sort}
                          variant={sortBy === sort ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSortBy(sort)}
                          className="flex-1 gap-2 capitalize text-sm hover-lift"
                        >
                          <Icon className="h-4 w-4" />
                          {sort}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-3">
                <Badge 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm hover-lift"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Topics
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm hover-lift"
                    style={selectedCategory === category.id ? {
                      backgroundColor: category.color,
                      borderColor: category.color,
                      color: 'white'
                    } : {
                      borderColor: category.color,
                      color: category.color,
                      backgroundColor: 'transparent'
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                <>
                  {filteredPosts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CleanPostCard post={post} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="max-w-lg mx-auto space-y-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <MessageSquare className="h-12 w-12 text-accent/60" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-large text-muted-foreground">
                        {searchTerm ? 'No posts found' : 'No discussions yet'}
                      </h3>
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {searchTerm 
                          ? `No posts match "${searchTerm}". Try adjusting your search terms or exploring different categories.`
                          : 'Be the first to start a meaningful discussion about human enhancement, consciousness, and our collective future.'
                        }
                      </p>
                    </div>
                    
                    {user && !searchTerm && (
                      <Link to="/create-post">
                        <Button size="lg" className="gap-2 hover-lift">
                          <Plus className="h-5 w-5" />
                          Start the First Discussion
                        </Button>
                      </Link>
                    )}
                  </div>
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