import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, MapPin, Globe, Edit, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Sidebar from '@/components/Sidebar';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  location: string | null;
  created_at: string;
}

interface ProfilePost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  votes_score: number;
  view_count: number;
  comment_count?: number;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (user && profile) {
      checkFollowStatus();
      fetchFollowCounts();
    }
  }, [user, profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, created_at, votes_score, view_count')
        .eq('author_id', profileData.id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Add comment counts
      const postsWithComments = await Promise.all(
        (postsData || []).map(async (post) => {
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

      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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
      setIsFollowing(false);
    }
  };

  const fetchFollowCounts = async () => {
    if (!profile) return;
    
    try {
      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('user_follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id),
        supabase
          .from('user_follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profile.id)
      ]);

      setFollowerCount(followersResult.count || 0);
      setFollowingCount(followingResult.count || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const handleFollow = async () => {
    if (!user || !profile || followLoading || user.id === profile.id) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          });
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-16">
            <div className="animate-pulse space-y-8">
              <div className="h-24 w-24 bg-muted rounded-full"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-64"></div>
                <div className="h-4 bg-muted rounded w-96"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-16 text-center">
            <h1 className="text-2xl font-light text-muted-foreground mb-4">User not found</h1>
            <Link 
              to="/" 
              className="text-accent hover:text-accent/80 crisp-transition"
            >
              Return home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-16">
            
            {/* Profile header */}
            <div className="pb-16 border-b border-border/30">
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || profile.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium">
                      {(profile.full_name || profile.username).slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-light tracking-tight mb-2">
                        {profile.full_name || profile.username}
                      </h1>
                      <p className="text-muted-foreground font-mono text-sm">
                        @{profile.username}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isOwnProfile ? (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit profile
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={handleFollow}
                            disabled={followLoading}
                          >
                            {isFollowing ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground leading-relaxed mb-4 font-light">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-6">
                      <span className="font-mono">
                        <strong className="text-foreground">{followerCount}</strong> followers
                      </span>
                      <span className="font-mono">
                        <strong className="text-foreground">{followingCount}</strong> following
                      </span>
                      <span className="font-mono">
                        <strong className="text-foreground">{posts.length}</strong> posts
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website_url && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <a 
                            href={profile.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-foreground crisp-transition"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      <span className="font-mono">
                        Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts */}
            <div className="pt-16">
              <h2 className="text-2xl font-light mb-12">Posts</h2>
              
              {posts.length > 0 ? (
                <div className="space-y-16">
                  {posts.map((post, index) => (
                    <article 
                      key={post.id}
                      className="group animate-fade-up hover-lift crisp-transition"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                    >
                      <div className="space-y-4">
                        <Link 
                          to={`/posts/${post.id}`}
                          className="block group/content"
                        >
                          <h3 className="text-xl font-light leading-tight mb-3 group-hover/content:text-accent crisp-transition">
                            {post.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed font-light">
                            {truncateContent(post.content)}
                          </p>
                        </Link>

                        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground font-mono">
                          <div className="flex items-center gap-4">
                            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                            <span>{post.votes_score} votes</span>
                            <span>{post.comment_count} replies</span>
                            <span>{post.view_count} views</span>
                          </div>
                          
                          <Link 
                            to={`/posts/${post.id}`}
                            className="hover:text-foreground crisp-transition"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-light">
                    {isOwnProfile ? "You haven't written any posts yet." : `${profile.full_name || profile.username} hasn't written any posts yet.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
    </div>
  );
};

export default Profile;