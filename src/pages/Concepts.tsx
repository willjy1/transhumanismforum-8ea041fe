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
          {/* Minimal Header */}
          <div className="max-w-2xl mx-auto px-8 pt-16 pb-12">
            <h1 className="text-4xl font-light tracking-tight mb-4">
              Concepts
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Key ideas shaping transhumanist thought
            </p>
          </div>

          {/* Minimal Concepts List */}
          <div className="max-w-2xl mx-auto px-8 pb-20">
            <div className="space-y-16">
              {concepts.map((concept, index) => (
                <article 
                  key={concept}
                  className="group animate-fade-in border-b border-border/50 pb-16 last:border-b-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h2 className="text-2xl font-medium tracking-tight group-hover:text-primary smooth-transition cursor-pointer">
                    {concept}
                  </h2>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Concepts;