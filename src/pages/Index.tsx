import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b border-foreground/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 relative">
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Main title */}
              <h1 className="font-display text-4xl md:text-6xl font-medium mb-8 tracking-tight text-foreground leading-tight">
                The Transhumanism Forum
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;