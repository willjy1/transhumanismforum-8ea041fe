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
          <div className="max-w-4xl mx-auto px-12 py-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <h1 className="text-display font-light tracking-tight">Concepts</h1>
                <p className="text-xl text-muted-foreground font-light">
                  Explore key concepts in transhumanism and human enhancement.
                </p>
              </div>
              
              <div className="grid gap-6">
                {concepts.map((concept, index) => (
                  <div 
                    key={concept}
                    className="group border border-border rounded-lg p-8 hover:border-accent crisp-transition hover-lift"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <h2 className="text-large font-medium group-hover:text-accent crisp-transition">
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