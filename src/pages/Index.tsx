import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
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
          {/* Hero Section - Minimal */}
          <div className="max-w-2xl mx-auto px-8 pt-24 pb-16">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-light tracking-tight leading-tight">
                  The Transhumanist Forum
                </h1>
                
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  A place for thoughtful discussion about human enhancement, longevity research, 
                  artificial intelligence, and the technologies that will shape our species' future.
                </p>
              </div>
              
              <div className="flex gap-6 pt-4">
                {user ? (
                  <Link 
                    to="/forum"
                    className="inline-flex items-center text-foreground hover:text-primary smooth-transition group"
                  >
                    <span className="text-lg font-light">Enter Forum</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 smooth-transition" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/auth"
                      className="inline-flex items-center text-foreground hover:text-primary smooth-transition group"
                    >
                      <span className="text-lg font-light">Get Started</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 smooth-transition" />
                    </Link>
                    <Link 
                      to="/forum"
                      className="text-lg font-light text-muted-foreground hover:text-foreground smooth-transition"
                    >
                      Browse Discussions
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Simple Feature List */}
          <div className="max-w-2xl mx-auto px-8 pb-20">
            <div className="border-t border-border/50 pt-16">
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-light tracking-tight mb-4">
                    What we discuss
                  </h2>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Human Enhancement",
                        description: "Genetic engineering, cybernetics, and cognitive augmentation"
                      },
                      {
                        title: "Longevity Research", 
                        description: "Life extension science, aging reversal, and biological immortality"
                      },
                      {
                        title: "AI & Consciousness",
                        description: "Artificial intelligence, neural interfaces, and digital minds"
                      },
                      {
                        title: "Future Society",
                        description: "Ethics, governance, and social implications of enhancement"
                      }
                    ].map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {topic.title}
                        </h3>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {!user && (
                  <div className="border-t border-border/50 pt-12">
                    <Link 
                      to="/auth"
                      className="inline-flex items-center text-foreground hover:text-primary smooth-transition group"
                    >
                      <span className="text-lg font-light">Join the discussion</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 smooth-transition" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
