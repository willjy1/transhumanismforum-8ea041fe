import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityItem {
  id: string;
  action: string;
  created_at: string;
  target_type: string | null;
  target_id: string | null;
  metadata: any;
  user_id: string;
  profiles: {
    username: string;
    full_name: string | null;
  } | null;
}

export const useActivityFeed = (userId?: string, limit: number = 10) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [userId, user, limit]);

  const fetchActivities = async () => {
    try {
      let query = supabase
        .from('user_activity')
        .select(`
          *,
          profiles(username, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        // Get activities for specific user
        query = query.eq('user_id', userId);
      } else if (user) {
        // Get activities from followed users (activity feed)
        const { data: follows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        const followingIds = follows?.map(f => f.following_id) || [];
        
        if (followingIds.length > 0) {
          query = query.in('user_id', [...followingIds, user.id]);
        } else {
          // If not following anyone, show own activities
          query = query.eq('user_id', user.id);
        }
      } else {
        // Public activities
        query = query.limit(5);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    action: string,
    targetType?: string,
    targetId?: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          action,
          target_type: targetType || null,
          target_id: targetId || null,
          metadata: metadata || null
        });

      // Refresh activities after logging
      fetchActivities();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return {
    activities,
    loading,
    logActivity,
    refreshActivities: fetchActivities
  };
};