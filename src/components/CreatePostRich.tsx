import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hash, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryMultiSelect } from '@/components/CategoryMultiSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RichTextEditor from '@/components/RichTextEditor';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const CreatePostRich = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityFeed();

  useEffect(() => {
    fetchCategories();
  }, []);

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
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          category_ids: categoryIds,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await logActivity('post_created', 'post', post.id, {
        title: title.trim(),
        category_ids: categoryIds
      });

      toast({
        title: "Post created successfully",
        description: "Your post has been published to the forum",
      });
      
      navigate('/forum');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-2xl mx-auto px-8 py-16">
              <div className="text-center">
                <h1 className="text-2xl font-light mb-4">Authentication Required</h1>
                <p className="text-muted-foreground mb-8">Please sign in to create a post.</p>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Header */}
            <div className="mb-8">
              <button 
                onClick={() => navigate('/forum')}
                className="flex items-center text-muted-foreground hover:text-foreground mb-6 crisp-transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </button>
              
              <h1 className="text-3xl font-light tracking-tight mb-3">
                Create Post
              </h1>
            </div>

            {/* Post Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <BookOpen className="h-5 w-5" />
                  New Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your post about?"
                      className="text-base"
                      maxLength={200}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {title.length}/200 characters
                    </div>
                  </div>

                  {/* Categories */}
                  <CategoryMultiSelect
                    categories={categories}
                    selectedCategoryIds={categoryIds}
                    onSelectionChange={setCategoryIds}
                  />

                  {/* Rich Content Editor */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Content</Label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write..."
                      className="min-h-[400px]"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/forum')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !content.trim()}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostRich;