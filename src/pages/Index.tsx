import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        
        <div className="flex-1">
          {/* Academic hero section */}
          <div className="max-w-4xl mx-auto px-8 py-20">
            <article className="prose prose-lg mx-auto text-center">
              
              {/* Main title */}
              <header className="mb-16">
              <h1 className="font-serif text-5xl font-normal mb-6">
                The Transhumanist Forum
              </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                  A forum for rigorous discussion of human enhancement, the expansion of consciousness, 
                  artificial intelligence, and the future of life itself.
                </p>
              </header>
              
              {/* Call to action */}
              <div className="mt-12 not-prose">
                {user ? (
                  <Link 
                    to="/forum"
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded border hover:bg-primary/90 crisp-transition shadow-subtle"
                  >
                    Enter Forum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link 
                    to="/forum"
                    className="inline-flex items-center px-6 py-3 border border-border bg-background text-foreground text-sm font-medium rounded hover:bg-muted crisp-transition shadow-subtle"
                  >
                    Browse Discussions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;