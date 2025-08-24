import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, MessageSquare, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuickTakes = () => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // This would submit to your quick takes endpoint
      // For now, just show success toast
      toast({
        title: "Success",
        description: "Your quick take has been posted!",
      });
      setContent('');
      setIsExpanded(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post quick take. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Quick Takes
          </CardTitle>
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-sm text-muted-foreground">
          Share exploratory, draft-stage, rough thoughts...
        </p>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="What's on your mind? Share a quick thought, question, or observation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {content.length}/1000 characters
                </p>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setContent('');
                      setIsExpanded(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!content.trim() || isSubmitting || content.length > 1000}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Please sign in to share your quick takes.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default QuickTakes;