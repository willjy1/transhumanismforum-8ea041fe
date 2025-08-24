import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, LogOut, PenTool, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from '@/components/NotificationCenter';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold hover:text-primary transition-colors">
          Transhumanist Forum
        </Link>
        
        {/* Search */}
        <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search discussions..." 
            className="pl-10 focus-ring"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <>
              <NotificationCenter />
              
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="w-9 h-9 p-0 hover-lift"
              >
                <Link to="/create-post-rich">
                  <PenTool className="h-4 w-4" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover-lift">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to={`/profile/${user.email?.split('@')[0] || 'user'}`} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Join Forum</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;