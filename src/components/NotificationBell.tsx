import React, { useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const getNotificationLink = (notification: any) => {
    if (notification.related_post_id) {
      return `/post/${notification.related_post_id}`;
    }
    if (notification.related_user_id) {
      return `/profile/${notification.related_user_id}`;
    }
    return '#';
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 p-0"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg border bg-background">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-80">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id}>
                        <Link
                          to={getNotificationLink(notification)}
                          onClick={() => {
                            handleNotificationClick(notification.id, notification.is_read);
                            setIsOpen(false);
                          }}
                          className={`block p-3 rounded-lg hover:bg-muted/50 crisp-transition ${
                            !notification.is_read ? 'bg-accent/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm ${
                                !notification.is_read ? 'font-medium' : 'font-normal'
                              }`}>
                                {notification.title}
                              </div>
                              {notification.content && (
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.content}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-2">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </div>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-accent rounded-full ml-2 mt-1 flex-shrink-0" />
                            )}
                          </div>
                        </Link>
                        <Separator className="my-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};