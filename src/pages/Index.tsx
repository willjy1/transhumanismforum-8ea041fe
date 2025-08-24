import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Forum from './Forum';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Forum />
    </div>
  );
};

export default Index;
