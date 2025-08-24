import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
import { Link } from 'react-router-dom';

const Concepts = () => {
  const concepts = [
    'Artificial Intelligence',
    'Consciousness Research', 
    'Cosmism',
    'Human Enhancement',
    'Life Extension'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          {/* Clean Header */}
          <div className="max-w-2xl mx-auto px-8 py-16">
            <h1 className="text-3xl font-light tracking-tight mb-3">
              Concepts
            </h1>
          </div>

          {/* Clean Concepts List */}
          <div className="max-w-2xl mx-auto px-8 pb-20">
            <div className="space-y-6">
              {concepts.map((concept, index) => (
                <div 
                  key={concept}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h2 className="text-xl font-light tracking-tight hover:text-accent crisp-transition cursor-pointer py-2">
                    {concept}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Concepts;