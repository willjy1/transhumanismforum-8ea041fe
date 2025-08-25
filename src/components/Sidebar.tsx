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
    <div className="w-64 h-full bg-card/60 backdrop-blur-sm border-r flex flex-col">
      <div className="p-6 space-y-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavItem
            to="/"
            label="Home"
            isActive={isActive('/')}
          />
          
          <NavItem
            to="/forum"
            label="Posts"
            isActive={isActive('/forum') || isActive('/posts/top') || isActive('/posts/latest')}
          />

          <NavItem
            to="/notes"
            label="Notes"
            isActive={isActive('/notes')}
          />

          <NavItem
            to="/concepts"
            label="Concepts"
            isActive={isActive('/concepts')}
          />

          <NavItem
            to="/resources"
            label="Resources"
            isActive={isActive('/resources')}
          />

          <NavItem
            to="/community"
            label="Community"
            isActive={isActive('/community')}
          />

          {user && (
            <NavItem
              to="/messages"
              label="Messages"
              isActive={isActive('/messages')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;