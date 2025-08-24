import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
  const [libraryOpen, setLibraryOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  
  // Check if any library routes are active to keep it open
  const isLibraryActive = isActive('/library') || isActive('/resources');

  return (
    <div className="w-64 h-full bg-card border-r flex flex-col">
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

          {/* Library Section - Collapsible */}
          <Collapsible open={libraryOpen || isLibraryActive} onOpenChange={setLibraryOpen}>
            <CollapsibleTrigger className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors",
              isLibraryActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}>
              <span>Library</span>
              {libraryOpen || isLibraryActive ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 space-y-1">
              <NavItem
                to="/library"
                label="Concepts"
                isActive={isActive('/library')}
              />
              <NavItem
                to="/resources"
                label="Resources"
                isActive={isActive('/resources')}
              />
            </CollapsibleContent>
          </Collapsible>

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