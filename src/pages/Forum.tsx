import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, ChevronUp, ChevronDown, Eye, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          votes_score,
          view_count,
          created_at,
          categories (name, color),
          profiles (username, full_name),
          comments!inner (count)
        `)
        .order('created_at', { ascending: false });

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
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Forum</h1>
          <p className="text-muted-foreground mt-2">
            Explore ideas about the future of humanity
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link to="/create-post">Create Post</Link>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                {user && (
                  <div className="flex flex-col items-center space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => vote(post.id, 1)}
                      className="p-1"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{post.votes_score}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => vote(post.id, -1)}
                      className="p-1"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.categories && (
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: post.categories.color + '20', color: post.categories.color }}
                      >
                        {post.categories.name}
                      </Badge>
                    )}
                  </div>
                  
                  <Link to={`/post/${post.id}`} className="block">
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.profiles?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comment_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.view_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to start a discussion about transhumanism!
            </p>
            {user && (
              <Button asChild>
                <Link to="/create-post">Create First Post</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Forum;