import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import NoteComposer from './NoteComposer';
import { Link } from 'react-router-dom';

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

interface NoteCardProps {
  note: Note;
  onLikeToggle: (noteId: string, isLiked: boolean) => void;
  onDelete?: (noteId: string) => void;
  onReplyCreated?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onLikeToggle, onDelete, onReplyCreated }) => {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user || user.id !== note.author_id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      });

      if (onDelete) {
        onDelete(note.id);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplyCreated = () => {
    setShowReplyComposer(false);
    // Trigger refresh from parent component
    if (onReplyCreated) {
      onReplyCreated();
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'some time ago';
    }
  };

  return (
    <div>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <Link to={`/profile/${note.profiles?.username}`} className="flex-shrink-0">
              <Avatar className="h-10 w-10 hover:opacity-80 transition-opacity">
                <AvatarImage src={note.profiles?.avatar_url || undefined} />
                <AvatarFallback>
                  {note.profiles?.full_name?.[0] || note.profiles?.username?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Link 
                    to={`/profile/${note.profiles?.username}`}
                    className="font-medium text-sm hover:underline truncate"
                  >
                    {note.profiles?.full_name || note.profiles?.username}
                  </Link>
                  <span className="text-muted-foreground text-sm">
                    @{note.profiles?.username}
                  </span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTimeAgo(note.created_at)}
                  </span>
                </div>

                {/* Actions Menu */}
                {user && user.id === note.author_id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Content */}
              <div className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {note.content}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyComposer(!showReplyComposer)}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {note.replies_count > 0 && (
                    <span className="text-xs">{note.replies_count}</span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikeToggle(note.id, note.user_liked || false)}
                  disabled={!user}
                  className={`h-8 px-2 transition-colors ${
                    note.user_liked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 mr-1 ${note.user_liked ? 'fill-current' : ''}`} 
                  />
                  {note.likes_count > 0 && (
                    <span className="text-xs">{note.likes_count}</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Composer */}
      {showReplyComposer && (
        <div className="mt-2 ml-12">
          <NoteComposer
            placeholder="Write a reply..."
            replyTo={note.id}
            onNoteCreated={handleReplyCreated}
            onCancel={() => setShowReplyComposer(false)}
          />
        </div>
      )}
    </div>
  );
};

export default NoteCard;