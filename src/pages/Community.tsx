import React from 'react';
import { Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const Community = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Community
              </h1>
            </div>

            {/* Events Section */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                  <h2 className="text-2xl font-light tracking-tight">Events</h2>
                </div>
                
                <div className="text-center py-20">
                  <h3 className="text-xl font-light mb-4">No Events Scheduled</h3>
                  <p className="text-muted-foreground">
                    Check back later for upcoming community events and workshops.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;