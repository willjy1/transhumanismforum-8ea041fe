import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
      "block text-sm font-light transition-colors py-1",
      isActive 
        ? "text-foreground" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {label}
  </Link>
);

const MinimalSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-48 bg-background border-r border-border/30 min-h-screen pt-6">
      <div className="px-6 space-y-8">
        
        {/* Main Navigation */}
        <div className="space-y-2">
          <NavItem
            to="/"
            label="Home"
            isActive={isActive('/')}
          />
          <NavItem
            to="/thinkers"
            label="Thinkers"
            isActive={isActive('/thinkers')}
          />
          {user && (
            <NavItem
              to="/messages"
              label="Messages"
              isActive={isActive('/messages')}
            />
          )}
        </div>

        {/* Library Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Library
          </h3>
          <div className="space-y-2 pl-0">
            <NavItem
              to="/library"
              label="Library"
              isActive={isActive('/library')}
            />
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Community
          </h3>
          <div className="space-y-2 pl-0">
            <NavItem
              to="/about"
              label="About"
              isActive={isActive('/about')}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MinimalSidebar;