import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, LogOut, PenTool } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 elegant-shadow">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 smooth-transition">
          The Transhumanist Forum
        </Link>
        
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search discussions..." 
            className="pl-10 bg-muted/50 border-0 focus:bg-card focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="font-medium hover:bg-primary/10 hover:text-primary smooth-transition">
                <Link to="/create-post">
                  <PenTool className="h-4 w-4 mr-2" />
                  Write
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive smooth-transition">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;