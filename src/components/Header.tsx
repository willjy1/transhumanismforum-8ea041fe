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
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-light tracking-tight hover:text-primary smooth-transition">
          The Transhumanist Forum
        </Link>
        
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-transparent border-0 focus:bg-muted/20 focus:ring-1 focus:ring-border"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/create-post"
                className="text-sm font-light text-muted-foreground hover:text-foreground smooth-transition"
              >
                Write
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-sm font-light text-muted-foreground hover:text-foreground smooth-transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/auth"
              className="text-sm font-light hover:text-primary smooth-transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;