import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User2, 
  MapPin, 
  Globe, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Star,
  UserPlus,
  UserCheck,
  Bookmark,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
import CleanPostCard from '@/components/CleanPostCard';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  location?: string;
  created_at: string;
  karma: number;
  post_count: number;
  comment_count: number;
}

interface UserPost {
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

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [bookmarks, setBookmarks] = useState<UserPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (username) {
      fetchProfile();
      fetchUserPosts();
      checkFollowStatus();
      fetchFollowCounts();
    }
  }, [username, user]);

  useEffect(() => {
    if (activeTab === 'bookmarks' && profile && user?.id === profile.id) {
      fetchBookmarks();
    }
  }, [activeTab, profile, user]);

  const fetchProfile = async () => {
    if (!username) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Profile not found",
        description: "The requested user profile could not be found.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    if (!username) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profileData) return;

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          votes_score,
          view_count,
          categories(name, color)
        `)
        .eq('author_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const fetchBookmarks = async () => {
    if (!profile || !user || user.id !== profile.id) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          posts:posts!inner(
            id,
            title,
            content,
            created_at,
            votes_score,
            view_count,
            categories(name, color)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const bookmarkedPosts = data?.map(item => item.posts).filter(Boolean) || [];
      setBookmarks(bookmarkedPosts as UserPost[]);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !profile || user.id === profile.id) return;

    try {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      // Not following
    }
  };

  const fetchFollowCounts = async () => {
    if (!profile) return;

    try {
      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', profile.id),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', profile.id)
      ]);

      setFollowerCount(followersResult.count || 0);
      setFollowingCount(followingResult.count || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const toggleFollow = async () => {
    if (!user || !profile || user.id === profile.id) return;

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
        
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast({ title: "Unfollowed user" });
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          });
        
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast({ title: "Following user" });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
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
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center py-16">
                <User2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-light text-muted-foreground mb-2">
                  User not found
                </h1>
                <p className="text-muted-foreground">
                  The requested user profile does not exist.
                </p>
              </div>
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
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Profile Header */}
            <Card className="p-8 mb-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl font-light bg-accent/10 text-accent">
                    {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-light tracking-tight">
                        {profile.full_name || profile.username}
                      </h1>
                      {profile.full_name && (
                        <p className="text-muted-foreground">@{profile.username}</p>
                      )}
                    </div>

                    {/* Follow Button */}
                    {!isOwnProfile && user && (
                      <Button
                        onClick={toggleFollow}
                        variant={isFollowing ? "outline" : "default"}
                        className="gap-2"
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.website_url && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={profile.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-accent crisp-transition"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="font-medium">{profile.karma}</span>
                      <span className="text-muted-foreground text-sm">karma</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{posts.length}</span>
                      <span className="text-muted-foreground text-sm">posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">{profile.comment_count}</span>
                      <span className="text-muted-foreground text-sm">comments</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-4">
                      <span className="text-sm">
                        <span className="font-medium">{followerCount}</span>{' '}
                        <span className="text-muted-foreground">followers</span>
                      </span>
                      <span className="text-sm">
                        <span className="font-medium">{followingCount}</span>{' '}
                        <span className="text-muted-foreground">following</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Posts ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                {isOwnProfile && (
                  <TabsTrigger value="bookmarks" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    Bookmarks
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                        <CleanPostCard 
                          key={post.id} 
                          post={{
                            ...post,
                            author_id: profile.id,
                            is_pinned: false,
                            category_id: null,
                            updated_at: post.created_at,
                            profiles: {
                              username: profile.username,
                              full_name: profile.full_name
                            }
                          }} 
                        />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No posts yet
                    </h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "You haven't written any posts yet. Share your thoughts!" 
                        : "This user hasn't written any posts yet."
                      }
                    </p>
                    {isOwnProfile && (
                      <Link to="/create-post">
                        <Button className="mt-4">Write Your First Post</Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="text-center py-16">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Activity Feed
                  </h3>
                  <p className="text-muted-foreground">
                    Activity tracking coming soon
                  </p>
                </div>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="bookmarks" className="mt-6">
                  {bookmarks.length > 0 ? (
                    <div className="space-y-4">
                      {bookmarks.map((post) => (
                          <CleanPostCard 
                            key={post.id} 
                            post={{
                              ...post,
                              author_id: 'unknown',
                              is_pinned: false,
                              category_id: null,
                              updated_at: post.created_at
                            }} 
                          />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No bookmarks yet
                      </h3>
                      <p className="text-muted-foreground">
                        Posts you bookmark will appear here for easy access
                      </p>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;