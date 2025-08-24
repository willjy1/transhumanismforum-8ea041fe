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
  PenTool
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
          <NavItem
            to="/all-posts"
            icon={<FileText className="h-4 w-4" />}
            label="All Posts"
            isActive={isActive('/all-posts')}
          />
          <NavItem
            to="/thinkers"
            icon={<Users className="h-4 w-4" />}
            label="Thinkers"
            isActive={isActive('/thinkers')}
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
            to="/sequences"
            icon={<BookOpen className="h-4 w-4" />}
            label="Sequences"
            isActive={isActive('/sequences')}
          />
          <NavItem
            to="/concepts"
            icon={<Zap className="h-4 w-4" />}
            label="Concepts"
            isActive={isActive('/concepts')}
          />
          <NavItem
            to="/best-of"
            icon={<TrendingUp className="h-4 w-4" />}
            label="Best Of"
            isActive={isActive('/best-of')}
          />
        </div>

        <Separator />

        {/* Events Section */}
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
            
            {/* User Actions */}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/create-post">
                  <PenTool className="h-4 w-4 mr-2" />
                  Write Post
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;