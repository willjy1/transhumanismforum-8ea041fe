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
    <header className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between px-12 max-w-7xl mx-auto">
        {/* Logo with bold typography */}
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight hover:text-accent crisp-transition">
          The Transhumanist Forum
        </Link>
        
        {/* Search - Minimal and focused */}
        <div className="hidden md:flex relative max-w-md flex-1 mx-16">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search discussions..." 
            className="pl-12 bg-background border-border focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-none h-12"
          />
        </div>

        {/* Right Actions - Clean and modern */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <NotificationCenter />
              <Link 
                to="/create-post-rich"
                className="text-lg font-light text-muted-foreground hover:text-foreground crisp-transition hover-lift"
              >
                Write
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link 
              to="/auth"
              className="relative group"
            >
              <div className="absolute inset-0 bg-foreground transform scale-0 group-hover:scale-100 crisp-transition rounded-sm"></div>
              <span className="relative block px-6 py-3 font-light text-foreground group-hover:text-background crisp-transition">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;