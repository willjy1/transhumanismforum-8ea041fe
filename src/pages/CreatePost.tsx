import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          author_id: user.id,
          category_id: categoryId || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your post has been created successfully!",
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-16">
            {/* Minimal header */}
            <div className="mb-16">
              <h1 className="text-display font-light tracking-tight mb-4">Write</h1>
              <p className="text-muted-foreground font-light">Share your thoughts on transhumanism and the future of intelligence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Title - Large, prominent like Substack */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Post title..."
                  className="w-full text-4xl font-light placeholder:text-muted-foreground/50 
                           bg-transparent border-0 outline-0 focus:outline-0 resize-none
                           leading-tight tracking-tight"
                />
              </div>

              {/* Category selection - Minimal */}
              {categories.length > 0 && (
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-light text-muted-foreground">
                    Category
                  </Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="w-fit border-border/30 hover:border-border crisp-transition">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Content - Clean, distraction-free */}
              <div className="space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Start writing..."
                  className="w-full min-h-[400px] text-lg leading-relaxed 
                           placeholder:text-muted-foreground/50 bg-transparent 
                           border-0 outline-0 focus:outline-0 resize-none font-light"
                />
              </div>

              {/* Actions - Minimal, right-aligned */}
              <div className="flex items-center justify-between pt-8 border-t border-border/30">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-foreground text-background hover:bg-foreground/90 crisp-transition"
                >
                  {loading ? 'Publishing...' : 'Publish'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePost;