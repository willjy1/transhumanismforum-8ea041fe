import React from 'react';
import { BookOpen } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const Resources = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Resources
              </h1>
            </div>

            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-xl font-light mb-4">No Resources Available</h2>
                <p className="text-muted-foreground">
                  Educational resources and materials will be added here.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;