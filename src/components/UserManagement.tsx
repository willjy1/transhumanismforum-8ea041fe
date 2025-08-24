import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Shield, Users, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserWithRole {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: string[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditor, setIsEditor] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkEditorRole();
      fetchUsers();
    }
  }, [user]);

  const checkEditorRole = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'editor')
        .maybeSingle();

      setIsEditor(!!data);
    } catch (error) {
      console.error('Error checking editor role:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .order('username');

      if (!profiles) return;

      // Fetch all user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Combine profiles with their roles
      const usersWithRoles = profiles.map(profile => {
        const roles = userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || [];
        return {
          ...profile,
          roles
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModeratorRole = async (userId: string, currentlyModerator: boolean) => {
    try {
      if (currentlyModerator) {
        // Remove moderator role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'moderator');

        toast({
          title: "Success",
          description: "Moderator role removed"
        });
      } else {
        // Add moderator role
        await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'moderator'
          });

        toast({
          title: "Success", 
          description: "Moderator role assigned"
        });
      }

      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error('Error toggling moderator role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'editor': return 'bg-purple-500';
      case 'moderator': return 'bg-blue-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isEditor) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You need editor permissions to access user management.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const isModerator = user.roles.includes('moderator');
            const isCurrentUser = user.id === user.id;
            
            return (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {(user.full_name || user.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.full_name || user.username}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                    
                    <div className="flex gap-1 mt-1">
                      {user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <Badge 
                            key={role} 
                            variant="secondary"
                            className={`text-white ${getRoleBadgeColor(role)}`}
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">user</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!user.roles.includes('editor') && !user.roles.includes('admin') && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={isModerator ? "destructive" : "default"}
                          size="sm"
                          className="gap-2"
                        >
                          {isModerator ? (
                            <>
                              <UserX className="h-4 w-4" />
                              Remove Moderator
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              Make Moderator
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {isModerator ? 'Remove Moderator Role' : 'Assign Moderator Role'}
                          </DialogTitle>
                          <DialogDescription>
                            {isModerator 
                              ? `Are you sure you want to remove moderator privileges from ${user.full_name || user.username}?`
                              : `Are you sure you want to make ${user.full_name || user.username} a moderator?`
                            }
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Button
                              variant={isModerator ? "destructive" : "default"}
                              onClick={() => toggleModeratorRole(user.id, isModerator)}
                            >
                              {isModerator ? 'Remove Role' : 'Assign Role'}
                            </Button>
                          </DialogTrigger>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No users found matching your search.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;