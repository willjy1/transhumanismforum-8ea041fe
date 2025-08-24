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
      "block px-3 py-2 text-sm rounded transition-colors",
      isActive 
        ? "bg-gray-100 text-gray-900 font-medium" 
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
    <nav className="w-56 bg-white border-r min-h-screen pt-6">
      <div className="px-4 space-y-6">
        
        {/* Main Navigation */}
        <div className="space-y-1">
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
          <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Library
          </h3>
          <div className="space-y-1">
            <NavItem
              to="/sequences"
              label="Sequences"
              isActive={isActive('/sequences')}
            />
            <NavItem
              to="/concepts"
              label="Concepts"
              isActive={isActive('/concepts')}
            />
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-3">
          <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Community
          </h3>
          <div className="space-y-1">
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