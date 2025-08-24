import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-b border-foreground/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          <div className="min-h-[90vh] flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-8 text-center">
              {/* Main title */}
              <h1 className="text-6xl font-semibold mb-8 tracking-tight text-foreground leading-tight">
                The Transhumanist Forum
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;