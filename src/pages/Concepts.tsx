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
          <div className="max-w-4xl mx-auto px-12 py-32">
            <div className="space-y-20">
              <h1 className="text-display font-light tracking-tight">Concepts</h1>
              
              <div className="space-y-8">
                {concepts.map((concept, index) => (
                  <div 
                    key={concept}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <h2 className="text-hero font-light tracking-tight hover:text-accent crisp-transition cursor-pointer">
                      {concept}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Concepts;