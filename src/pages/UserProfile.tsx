import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, Users, FileText, MessageSquare, Heart, BookOpen, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  location?: string;
  created_at: string;
  post_count: number;
  comment_count: number;
  followers_count: number;
  following_count: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  votes_score: number;
  view_count: number;
  categories?: {
    name: string;
    color: string;
  };
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  votes_score: number;
  posts: {
    id: string;
    title: string;
  };
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profile && user) {
      checkFollowStatus();
    }
  }, [profile, user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(profileData);

      // Fetch user's posts, comments, and notes in parallel
      await Promise.all([
        fetchUserPosts(profileData.id),
        fetchUserComments(profileData.id),
        fetchUserNotes(profileData.id)
      ]);

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Profile not found",
        description: "The user profile could not be found.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, content, created_at, votes_score, view_count,
          categories(name, color)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const fetchUserComments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, content, created_at, votes_score,
          posts(id, title)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching user comments:', error);
    }
  };

  const fetchUserNotes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          id, content, created_at, likes_count, replies_count
        `)
        .eq('author_id', userId)
        .is('parent_id', null) // Only top-level notes, not replies
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching user notes:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !profile || user.id === profile.id) return;

    try {
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
        .maybeSingle();

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const toggleFollow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to follow users",
        variant: "destructive"
      });
      return;
    }

    if (!profile || user.id === profile.id) return;

    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
        
        setIsFollowing(false);
        toast({ title: "Unfollowed user" });
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          });
        
        setIsFollowing(true);
        toast({ title: "Following user" });

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: profile.id,
            type: 'follow',
            title: 'New follower',
            content: `${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone'} started following you`,
            related_user_id: user.id
          });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Could not update follow status",
        variant: "destructive"
      });
    }
  };

  const sendMessage = () => {
    toast({
      title: "Messages feature coming soon",
      description: "Direct messaging will be available soon"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-8 py-16">
              <div className="animate-pulse space-y-8">
                <div className="flex items-start gap-8">
                  <div className="h-32 w-32 bg-muted rounded-full"></div>
                  <div className="space-y-4 flex-1">
                    <div className="h-10 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-8 py-16 text-center">
              <h1 className="text-3xl font-light mb-6">User not found</h1>
              <p className="text-muted-foreground text-lg mb-8">The user profile you're looking for doesn't exist.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;
  const joinDate = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{profile.full_name || profile.username} | Beyond Humanity</title>
        <meta name="description" content={profile.bio || `Profile of ${profile.full_name || profile.username}`} />
      </Helmet>

      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-8 py-20">
            {/* Profile Header */}
            <div className="space-y-12 mb-16">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl">
                    {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-5xl font-light tracking-tight">
                      {profile.full_name || profile.username}
                    </h1>
                    {profile.full_name && (
                      <p className="text-2xl text-muted-foreground font-light">@{profile.username}</p>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-xl leading-relaxed font-light max-w-3xl text-muted-foreground">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-8 text-lg text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>Joined {joinDate}</span>
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website_url && (
                      <a 
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-accent crisp-transition"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {!isOwnProfile && user && (
                    <>
                      <Button
                        onClick={toggleFollow}
                        variant={isFollowing ? "outline" : "default"}
                        size="lg"
                        className="gap-3 px-8"
                      >
                        <Users className="h-5 w-5" />
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={sendMessage}
                        className="gap-3 px-8"
                      >
                        <MessageSquare className="h-5 w-5" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/30">
                <div className="text-center">
                  <div className="text-3xl font-light">{profile.post_count || 0}</div>
                  <div className="text-lg text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light">{profile.comment_count || 0}</div>
                  <div className="text-lg text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light">{profile.followers_count || 0}</div>
                  <div className="text-lg text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light">{profile.following_count || 0}</div>
                  <div className="text-lg text-muted-foreground">Following</div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
              <TabsList className="grid w-full grid-cols-3 h-14">
                <TabsTrigger value="posts" className="gap-3 text-lg">
                  <FileText className="h-5 w-5" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-3 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Comments
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-3 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-8">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="p-8 hover:border-accent/50 crisp-transition">
                      <div className="space-y-6">
                        <div className="flex items-start justify-between gap-6">
                          <Link 
                            to={`/post/${post.id}`}
                            className="block hover:text-accent crisp-transition flex-1"
                          >
                            <h3 className="text-2xl font-light mb-4 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                              {post.content.substring(0, 300)}...
                            </p>
                          </Link>
                          
                          {post.categories && (
                            <Badge 
                              variant="outline" 
                              className="text-base px-4 py-2"
                              style={{ 
                                borderColor: post.categories.color,
                                color: post.categories.color,
                                backgroundColor: `${post.categories.color}15`
                              }}
                            >
                              {post.categories.name}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-8 text-lg text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>{post.votes_score} points</span>
                          </div>
                          <span>{post.view_count} views</span>
                          <time>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No posts yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-8">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment.id} className="p-8 hover:border-accent/50 crisp-transition">
                      <div className="space-y-6">
                        <div className="text-lg text-muted-foreground">
                          Comment on{' '}
                          <Link 
                            to={`/post/${comment.posts.id}`}
                            className="text-accent hover:underline font-medium"
                          >
                            {comment.posts.title}
                          </Link>
                        </div>
                        
                        <p className="text-lg leading-relaxed">
                          {comment.content}
                        </p>
                        
                        <div className="flex items-center gap-8 text-lg text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>{comment.votes_score} points</span>
                          </div>
                          <time>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</time>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No comments yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-8">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <Card key={note.id} className="p-8 hover:border-accent/50 crisp-transition">
                      <div className="space-y-6">
                        <div className="text-lg leading-relaxed font-light whitespace-pre-wrap">
                          {note.content}
                        </div>
                        
                        <div className="flex items-center gap-8 text-lg text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>{note.likes_count} likes</span>
                          </div>
                          {note.replies_count > 0 && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              <span>{note.replies_count} replies</span>
                            </div>
                          )}
                          <time>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</time>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No notes yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;