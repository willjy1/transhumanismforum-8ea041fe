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
                    Beyond
                    <br />
                    <span className="relative">
                      Human
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent animate-scale-in" 
                           style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                      </div>
                    </span>
                  </h1>
                  
                  <p className="text-xl max-w-2xl leading-relaxed font-light text-muted-foreground">
                    A forum for rigorous discussion of human enhancement, the expansion of consciousness, 
                    artificial intelligence, and the future of life itself.
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
                    <Link 
                      to="/forum"
                      className="group relative inline-flex items-center text-2xl font-light hover-lift"
                    >
                      <span className="relative z-10">Browse Discussions</span>
                      <ArrowUpRight className="h-6 w-6 ml-3 crisp-transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                      <div className="absolute inset-0 -z-10 bg-accent/5 scale-0 group-hover:scale-100 crisp-transition rounded-lg -m-4"></div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Index;
