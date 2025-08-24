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
        
        <main className="flex-1">
          {/* Clean Hero Section with enhanced spacing */}
          <div className="min-h-[85vh] flex items-center">
            <div className="max-w-5xl mx-auto px-12 py-20">
              <div className="space-y-16 animate-fade-up">
                
                {/* Main headline with improved typography */}
                <div className="space-y-12">
                  <h1 className="text-display">
                    Beyond
                    <br />
                    <span className="relative">
                      Humanity
                      <div className="absolute -bottom-1 left-0 w-full h-px bg-foreground animate-scale-in" 
                           style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                      </div>
                    </span>
                  </h1>
                  
                  <p className="text-body max-w-3xl text-muted-foreground leading-relaxed">
                    A forum for rigorous discussion of human enhancement, the expansion of consciousness, 
                    artificial intelligence, and the future of life itself.
                  </p>
                </div>
                
                {/* CTA with subtle interaction */}
                <div className="flex items-center gap-16 pt-8">
                  {user ? (
                    <Link 
                      to="/forum"
                      className="group relative inline-flex items-center text-2xl hover-lift"
                    >
                      <span className="relative z-10 font-light">Enter Forum</span>
                      <ArrowRight className="h-6 w-6 ml-4 crisp-transition group-hover:translate-x-2" />
                      <div className="absolute inset-0 -z-10 bg-muted/30 scale-0 group-hover:scale-100 crisp-transition rounded-lg -mx-6 -my-3"></div>
                    </Link>
                  ) : (
                    <Link 
                      to="/forum"
                      className="group relative inline-flex items-center text-2xl hover-lift"
                    >
                      <span className="relative z-10 font-light">Browse Discussions</span>
                      <ArrowRight className="h-6 w-6 ml-4 crisp-transition group-hover:translate-x-2" />
                      <div className="absolute inset-0 -z-10 bg-muted/30 scale-0 group-hover:scale-100 crisp-transition rounded-lg -mx-6 -my-3"></div>
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