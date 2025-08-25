import React, { useState, useEffect } from 'react';
import { Search, User, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface ProfileSearchProps {
  onMessageUser?: (userId: string, username: string) => void;
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({ onMessageUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchProfiles();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio')
        .or(`username.ilike.%${searchQuery}%, full_name.ilike.%${searchQuery}%`)
        .neq('id', user?.id || '')
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      toast({
        title: "Search error",
        description: "Failed to search profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageUser = async (profile: Profile) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to send messages",
        variant: "destructive"
      });
      return;
    }

    if (onMessageUser) {
      onMessageUser(profile.id, profile.username);
    } else {
      // Create or find existing conversation
      try {
        const { data: existingConversation } = await supabase
          .from('messages')
          .select('id')
          .or(`and(sender_id.eq.${user.id}, recipient_id.eq.${profile.id}), and(sender_id.eq.${profile.id}, recipient_id.eq.${user.id})`)
          .limit(1)
          .maybeSingle();

        // Navigate to messages page with the conversation
        navigate('/messages', { state: { startConversationWith: profile } });
      } catch (error) {
        console.error('Error checking conversation:', error);
        toast({
          title: "Error",
          description: "Failed to start conversation",
          variant: "destructive"
        });
      }
    }
  };

  const handleViewProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="text-center py-4 text-muted-foreground">
          Searching...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {searchResults.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{profile.full_name || profile.username}</h4>
                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProfile(profile.username)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessageUser(profile)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery.trim().length > 2 && searchResults.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;