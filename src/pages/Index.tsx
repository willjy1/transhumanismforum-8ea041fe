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
          <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
            <div className="max-w-4xl mx-auto px-8 py-32 text-center">
              <div className="space-y-12 animate-fade-up">
                
                {/* Main headline with improved typography */}
                <div className="space-y-8">
                  <h1 className="text-display font-light tracking-tight">
                    The Transhumanist
                    <br />
                    <span className="relative font-normal">
                      Forum
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary animate-scale-in" 
                           style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                      </div>
                    </span>
                  </h1>
                  
                  <p className="text-large max-w-2xl mx-auto text-muted-foreground leading-relaxed font-light">
                    A space for rigorous discussion about human enhancement, artificial intelligence, 
                    and the future of consciousness
                  </p>
                </div>
                
                {/* CTA with subtle interaction */}
                <div className="pt-8">
                  {user ? (
                    <Link 
                      to="/forum"
                      className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 crisp-transition shadow-medium hover:shadow-large"
                    >
                      <span className="font-medium">Enter Forum</span>
                      <ArrowRight className="h-5 w-5 ml-3 crisp-transition group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <Link 
                      to="/forum"
                      className="group inline-flex items-center px-8 py-4 border border-border bg-card hover:bg-muted/50 rounded-lg crisp-transition shadow-subtle hover:shadow-medium"
                    >
                      <span className="font-medium text-foreground">Explore Discussions</span>
                      <ArrowRight className="h-5 w-5 ml-3 crisp-transition group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Index;