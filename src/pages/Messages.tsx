import React from 'react';
import Sidebar from '@/components/Sidebar';

const Messages = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-medium mb-4">Messages</h1>
            <p className="text-muted-foreground">Direct messaging feature coming soon.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;