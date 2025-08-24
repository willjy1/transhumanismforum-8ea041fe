import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-full bg-card border-r flex flex-col">
      <div className="p-6 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavItem
            to="/"
            label="Home"
            isActive={isActive('/')}
          />
          {user && (
            <NavItem
              to="/messages"
              label="Messages"
              isActive={isActive('/messages')}
            />
          )}
        </div>

        <Separator />

        {/* Library Section */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Library
          </h3>
          <NavItem
            to="/library"
            label="Concepts"
            isActive={isActive('/library')}
          />
          <NavItem
            to="/thinkers"
            label="Thinkers"
            isActive={isActive('/thinkers')}
          />
          <NavItem
            to="/resources"
            label="Resources"
            isActive={isActive('/resources')}
          />
          <NavItem
            to="/forum"
            label="Posts"
            isActive={isActive('/forum') || isActive('/posts/top') || isActive('/posts/latest')}
          />
        </div>

        <Separator />

        {/* Community Section */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Community
          </h3>
          <NavItem
            to="/events"
            label="Events"
            isActive={isActive('/events')}
          />
        </div>

        {user && (
          <>
            <Separator />
            
            {/* User Actions - Removed redundant Write Post button */}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;