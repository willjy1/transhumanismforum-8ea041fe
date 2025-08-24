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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
          The Transhumanist Forum
        </Link>
        
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-50 border-0 focus:bg-white"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link to="/create-post">
                  <PenTool className="h-4 w-4 mr-1" />
                  Write
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;