import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProfileSearch from '@/components/ProfileSearch';
import MessageThread from '@/components/MessageThread';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  other_user: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }

    // Check if we should start a conversation from navigation state
    if (location.state?.startConversationWith) {
      setSelectedConversation(location.state.startConversationWith);
      setShowSearch(false);
    }
  }, [user, location.state]);

  useEffect(() => {
    if (!user) return;

    // Check if WebSocket is available before setting up realtime
    const canUseRealtime =
      typeof window !== 'undefined' &&
      'WebSocket' in window &&
      window.WebSocket != null;

    if (!canUseRealtime) {
      console.log('[Messages] WebSocket not available, skipping realtime');
      return;
    }

    try {
      // Set up real-time subscription for new messages (both sent and received)
      const channel = supabase
        .channel('user-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, (payload) => {
          console.log('New message received:', payload);
          fetchConversations();
          // Show a notification
          toast({
            title: "New message",
            description: "You have received a new message",
          });
        })
        .on('postgres_changes', {
          event: 'INSERT', 
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`
        }, (payload) => {
          console.log('Message sent:', payload);
          fetchConversations();
        })
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn('[Messages] Error removing channel:', err);
        }
      };
    } catch (err) {
      console.warn('[Messages] Realtime not available:', err);
      return;
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all messages where user is sender or recipient
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_id, recipient_id, is_read,
          sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(id, username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id}, recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, any>();

      messages?.forEach((message) => {
        const isFromUser = message.sender_id === user.id;
        const otherUser = isFromUser ? message.recipient : message.sender;
        const conversationId = otherUser.id;

        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            other_user: otherUser,
            last_message: {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id
            },
            unread_count: 0,
            messages: []
          });
        }

        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(message);

        // Count unread messages from the other user
        if (!isFromUser && !message.is_read) {
          conversation.unread_count++;
        }

        // Update last message if this one is more recent
        if (new Date(message.created_at) > new Date(conversation.last_message.created_at)) {
          conversation.last_message = {
            content: message.content,
            created_at: message.created_at,
            sender_id: message.sender_id
          };
        }
      });

      const conversationList = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime());

      setConversations(conversationList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = (userId: string, username: string) => {
    // Find if conversation already exists
    const existingConversation = conversations.find(conv => conv.other_user.id === userId);
    
    if (existingConversation) {
      setSelectedConversation(existingConversation.other_user);
    } else {
      // Create new conversation object
      setSelectedConversation({
        id: userId,
        username: username,
        full_name: undefined,
        avatar_url: undefined
      });
    }
    setShowSearch(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation.other_user);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center py-16">
                <h1 className="text-2xl font-medium mb-4">Messages</h1>
                <p className="text-muted-foreground">Sign in to access your messages.</p>
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
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Messages
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSearch(!showSearch)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    {showSearch ? (
                      <div className="p-4">
                        <ProfileSearch onMessageUser={handleStartConversation} />
                      </div>
                    ) : (
                      <ScrollArea className="h-full">
                        {loading ? (
                          <div className="p-4 text-center text-muted-foreground">
                            Loading conversations...
                          </div>
                        ) : conversations.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No conversations yet</p>
                            <p className="text-sm">Search for users to start messaging</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {conversations.map((conversation) => (
                              <button
                                key={conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                                className={`relative w-full p-4 text-left hover:bg-accent/50 transition-colors ${
                                  selectedConversation?.id === conversation.other_user.id ? 'bg-accent/20' : ''
                                }`}
                              >
                                {selectedConversation?.id === conversation.other_user.id && (
                                  <div className="absolute right-0 top-0 h-full w-1 bg-primary rounded-l-sm"></div>
                                )}
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={conversation.other_user.avatar_url || undefined} />
                                    <AvatarFallback>
                                      {(conversation.other_user.full_name || conversation.other_user.username).charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium truncate">
                                        {conversation.other_user.full_name || conversation.other_user.username}
                                      </h4>
                                      {conversation.unread_count > 0 && (
                                        <Badge variant="default" className="ml-2">
                                          {conversation.unread_count}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {conversation.last_message.sender_id === user.id ? 'You: ' : ''}
                                      {conversation.last_message.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Message Thread */}
              <div className="lg:col-span-2">
                {selectedConversation ? (
                  <MessageThread
                    recipientProfile={selectedConversation}
                    onBack={() => setSelectedConversation(null)}
                    onMessageSent={() => fetchConversations()}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose an existing conversation or search for users to start messaging
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;