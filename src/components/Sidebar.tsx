import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Zap,
  Settings,
  Clock,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    {icon}
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
            icon={<Home className="h-4 w-4" />}
            label="Home"
            isActive={isActive('/')}
          />
          {user && (
            <NavItem
              to="/messages"
              icon={<MessageSquare className="h-4 w-4" />}
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
            icon={<Zap className="h-4 w-4" />}
            label="Concepts"
            isActive={isActive('/library')}
          />
          <NavItem
            to="/thinkers"
            icon={<Users className="h-4 w-4" />}
            label="Thinkers"
            isActive={isActive('/thinkers')}
          />
          <NavItem
            to="/resources"
            icon={<BookOpen className="h-4 w-4" />}
            label="Resources"
            isActive={isActive('/resources')}
          />
          <NavItem
            to="/forum"
            icon={<FileText className="h-4 w-4" />}
            label="Posts"
            isActive={isActive('/forum') || isActive('/posts/top') || isActive('/posts/latest')}
          />
          
          {/* Posts Subsection */}
          {(isActive('/forum') || isActive('/posts/top') || isActive('/posts/latest')) && (
            <div className="pl-3 pt-2 space-y-1">
              <NavItem
                to="/posts/top"
                icon={<TrendingUp className="h-3 w-3" />}
                label="Top"
                isActive={isActive('/posts/top')}
              />
              <NavItem
                to="/posts/latest"
                icon={<Clock className="h-3 w-3" />}
                label="Latest" 
                isActive={isActive('/posts/latest')}
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Community Section */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Community
          </h3>
          <NavItem
            to="/events"
            icon={<Calendar className="h-4 w-4" />}
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