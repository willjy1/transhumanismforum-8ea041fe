import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Sequences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-8 pt-16 pb-20">
            <div className="space-y-12">
              <div>
                <h1 className="text-4xl font-light tracking-tight mb-4">
                  Sequences
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Curated series of posts that explore complex transhumanist topics in depth. 
                  Each sequence builds concepts progressively, designed to be read in order.
                </p>
              </div>
              
              <div className="border-t border-border/50 pt-12">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-6">
                      Planned Sequences
                    </h2>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Life Extension Fundamentals",
                          description: "Biology, medicine, and the science of aging"
                        },
                        {
                          title: "AI Safety & Alignment",
                          description: "Ensuring beneficial artificial intelligence"
                        },
                        {
                          title: "Enhancement Ethics",
                          description: "Moral considerations in human improvement"
                        },
                        {
                          title: "Cryonics: Theory & Practice",
                          description: "Preservation science and protocols"
                        },
                        {
                          title: "The Economics of Immortality",
                          description: "Societal implications of life extension"
                        }
                      ].map((sequence, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-lg font-medium">
                            {sequence.title}
                          </h3>
                          <p className="text-muted-foreground font-light leading-relaxed">
                            {sequence.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-8">
                    <p className="text-sm text-muted-foreground font-light">
                      Sequences will be published as the community grows and expert contributors 
                      develop comprehensive content series.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sequences;