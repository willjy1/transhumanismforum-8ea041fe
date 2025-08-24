import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Sequences = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-16">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">Sequences</h1>
              <p className="text-gray-600">Curated sequences of posts coming soon.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sequences;