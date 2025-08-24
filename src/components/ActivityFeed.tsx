import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  ThumbsUp, 
  BookOpen, 
  UserPlus,
  Eye,
  Edit3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  userId?: string;
  title?: string;
  limit?: number;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  userId,
  title = "Recent Activity",
  limit = 10,
  className
}) => {
  const { activities, loading } = useActivityFeed(userId, limit);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'post_created':
        return <BookOpen className="h-4 w-4" />;
      case 'comment_created':
        return <MessageSquare className="h-4 w-4" />;
      case 'vote_cast':
        return <ThumbsUp className="h-4 w-4" />;
      case 'user_followed':
        return <UserPlus className="h-4 w-4" />;
      case 'post_viewed':
        return <Eye className="h-4 w-4" />;
      case 'post_updated':
        return <Edit3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'post_created':
        return 'text-blue-600';
      case 'comment_created':
        return 'text-green-600';
      case 'vote_cast':
        return 'text-orange-600';
      case 'user_followed':
        return 'text-purple-600';
      case 'post_viewed':
        return 'text-gray-600';
      case 'post_updated':
        return 'text-indigo-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatActivityMessage = (activity: any) => {
    const username = activity.profiles?.username || 'Anonymous';
    
    switch (activity.action) {
      case 'post_created':
        return `${username} created a new post`;
      case 'comment_created':
        return `${username} commented on a post`;
      case 'vote_cast':
        const voteType = activity.metadata?.vote_type === 1 ? 'upvoted' : 'downvoted';
        return `${username} ${voteType} a ${activity.metadata?.target_type || 'post'}`;
      case 'user_followed':
        return `${username} followed a user`;
      case 'post_viewed':
        return `${username} viewed a post`;
      case 'post_updated':
        return `${username} updated a post`;
      default:
        return `${username} ${activity.action.replace('_', ' ')}`;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={cn(
                    "p-1.5 rounded-full bg-muted/50",
                    getActivityColor(activity.action)
                  )}>
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm leading-relaxed">
                        {formatActivityMessage(activity)}
                      </p>
                      
                      <time className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </time>
                    </div>
                    
                    {activity.metadata?.title && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        "{activity.metadata.title}"
                      </p>
                    )}
                    
                    {activity.target_id && activity.target_type === 'post' && (
                      <Link
                        to={`/post/${activity.target_id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View post →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No recent activity
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;