import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, LogOut, PenTool, User, Sparkles } from 'lucide-react';
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
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Enhanced Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Transhumanist Forum
          </span>
        </Link>
        
        {/* Enhanced Search */}
        <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-10 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full h-10 focus-ring"
            />
          </div>
        </div>

        {/* Enhanced Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <>
              <NotificationCenter />
              
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="w-10 h-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary group"
              >
                <Link to="/create-post-rich">
                  <PenTool className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback className="text-sm font-semibold bg-gradient-primary text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-card/95 backdrop-blur-md border border-border/60"
                >
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
              <Button variant="ghost" size="sm" asChild className="btn-ghost">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-primary text-sm px-4 py-2">
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