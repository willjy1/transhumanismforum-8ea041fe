import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CleanForum from './CleanForum';

const Index = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <CleanForum />;
};

export default Index;
