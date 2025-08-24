import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, MessageSquare, Users, LogOut, PenTool } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TranshumanForum
              </span>
            </Link>
            
            {user && (
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-foreground hover:text-primary transition-colors">
                  Forum
                </Link>
                <Link to="/thinkers" className="text-foreground hover:text-primary transition-colors">
                  Thinkers
                </Link>
                <Link to="/messages" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/create-post">
                    <PenTool className="h-4 w-4 mr-2" />
                    Write Post
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;