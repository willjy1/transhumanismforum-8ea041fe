import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import NoteComposer from '@/components/NoteComposer';
import NoteCard from '@/components/NoteCard';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp } from 'lucide-react';

interface Note {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  replies_count: number;
  parent_id: string | null;
  profiles: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  user_liked?: boolean;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending'>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes'
      }, (payload) => {
        console.log('Notes real-time update:', payload);
        fetchNotes();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public', 
        table: 'note_likes'
      }, (payload) => {
        console.log('Note likes real-time update:', payload);
        fetchNotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, user]);

  const fetchNotes = async () => {
    try {
      let query = supabase
        .from('notes')
        .select(`
          id,
          author_id,
          content,
          created_at,
          updated_at,
          likes_count,
          replies_count,
          parent_id
        `)
        .is('parent_id', null); // Only top-level notes, not replies

      // Apply sorting based on filter
      if (filter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: notesData, error } = await query.limit(50);

      if (error) throw error;

      // Fetch profile data for each note
      let notesWithProfiles = [];
      if (notesData && notesData.length > 0) {
        const authorIds = notesData.map(note => note.author_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', authorIds);

        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        notesWithProfiles = notesData.map(note => ({
          ...note,
          profiles: profilesMap.get(note.author_id) || {
            username: 'unknown',
            full_name: null,
            avatar_url: null
          }
        }));
      }

      // Check which notes the current user has liked
      let notesWithLikes = notesWithProfiles;
      if (user && notesWithProfiles.length > 0) {
        const noteIds = notesWithProfiles.map(note => note.id);
        const { data: userLikes } = await supabase
          .from('note_likes')
          .select('note_id')
          .eq('user_id', user.id)
          .in('note_id', noteIds);

        const likedNoteIds = new Set(userLikes?.map(like => like.note_id) || []);
        
        notesWithLikes = notesWithProfiles.map(note => ({
          ...note,
          user_liked: likedNoteIds.has(note.id)
        }));
      }

      setNotes(notesWithLikes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = () => {
    fetchNotes();
  };

  const handleLikeToggle = async (noteId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('note_likes')
          .delete()
          .eq('note_id', noteId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('note_likes')
          .insert({
            note_id: noteId,
            user_id: user.id
          });
      }
      
      // Update local state immediately for better UX
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId
            ? {
                ...note,
                user_liked: !isLiked,
                likes_count: isLiked ? note.likes_count - 1 : note.likes_count + 1
              }
            : note
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex">
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="p-6">
            {/* Header */}
            <div className="space-y-3 mb-8">
              <h1 className="text-3xl font-light tracking-tight">Notes</h1>
              <p className="text-muted-foreground">
                Share quick thoughts, observations, and connect with the community
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Recent
              </button>
              <button
                onClick={() => setFilter('trending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'trending'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Trending
              </button>
            </div>

            {/* Note Composer */}
            {user && (
              <div className="mb-6">
                <NoteComposer onNoteCreated={handleNoteCreated} />
              </div>
            )}

            {/* Notes Feed */}
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onLikeToggle={handleLikeToggle}
                />
              ))}

              {notes.length === 0 && !loading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                    <p className="text-muted-foreground">
                      {user ? 'Be the first to share a note!' : 'Sign in to start sharing notes with the community.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;