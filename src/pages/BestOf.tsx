import React from 'react';
import { TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const BestOf = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Best Of
              </h1>
              <p className="text-muted-foreground">
                The most insightful discussions and valuable contributions to transhumanist discourse
              </p>
            </div>

            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-xl font-light mb-4">No Content Available</h2>
                <p className="text-muted-foreground">
                  Featured content will appear here as the community grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestOf;