import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-b border-foreground/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <MinimalSidebar />
        
        <main className="flex-1">
          {/* Bold Hero Section */}
          <div className="min-h-[80vh] flex items-center">
            <div className="max-w-4xl mx-auto px-12 py-32">
              <div className="space-y-12 animate-fade-up">
                
                {/* Main headline with dramatic typography */}
                <div className="space-y-8">
                  <h1 className="text-display font-light tracking-tight">
                    The Future
                    <br />
                    <span className="relative">
                      of Humanity
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent animate-scale-in" 
                           style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                      </div>
                    </span>
                  </h1>
                  
                  <p className="text-xl max-w-2xl leading-relaxed font-light text-muted-foreground">
                    A forum for rigorous discussion about human enhancement, 
                    longevity research, artificial intelligence, and the technologies 
                    reshaping our species.
                  </p>
                </div>
                
                {/* CTA with bold interaction */}
                <div className="flex items-center gap-12 pt-8">
                  {user ? (
                    <Link 
                      to="/forum"
                      className="group relative inline-flex items-center text-2xl font-light hover-lift"
                    >
                      <span className="relative z-10">Enter Forum</span>
                      <ArrowUpRight className="h-6 w-6 ml-3 crisp-transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                      <div className="absolute inset-0 -z-10 bg-accent/5 scale-0 group-hover:scale-100 crisp-transition rounded-lg -m-4"></div>
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/auth"
                        className="group relative inline-flex items-center text-2xl font-light hover-lift"
                      >
                        <span className="relative z-10">Join Discussion</span>
                        <ArrowUpRight className="h-6 w-6 ml-3 crisp-transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                        <div className="absolute inset-0 -z-10 bg-accent/5 scale-0 group-hover:scale-100 crisp-transition rounded-lg -m-4"></div>
                      </Link>
                      
                      <Link 
                        to="/forum"
                        className="text-xl font-light text-muted-foreground hover:text-foreground crisp-transition"
                      >
                        Browse
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid - Bold & Minimal */}
          <div className="border-t border-border">
            <div className="max-w-4xl mx-auto px-12 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {[
                  {
                    number: "01",
                    title: "Human Enhancement",
                    description: "Genetic engineering, cybernetics, cognitive augmentation"
                  },
                  {
                    number: "02", 
                    title: "Longevity Research",
                    description: "Life extension, aging reversal, biological immortality"
                  },
                  {
                    number: "03",
                    title: "AI & Consciousness",
                    description: "Artificial intelligence, neural interfaces, digital minds"
                  },
                  {
                    number: "04",
                    title: "Future Society",
                    description: "Ethics, governance, social implications"
                  }
                ].map((topic, index) => (
                  <div 
                    key={index} 
                    className="group space-y-4 animate-fade-up hover-lift"
                    style={{ animationDelay: `${index * 0.1 + 0.3}s`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-start gap-6">
                      <span className="text-sm font-mono text-muted-foreground mt-2 crisp-transition group-hover:text-accent">
                        {topic.number}
                      </span>
                      <div className="space-y-3">
                        <h3 className="text-large font-medium group-hover:text-accent crisp-transition">
                          {topic.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed font-light">
                          {topic.description}
                        </p>
                      </div>
                    </div>
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

export default Index;
