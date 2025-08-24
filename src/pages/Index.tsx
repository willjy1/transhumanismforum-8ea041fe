import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

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
        <Sidebar />
        
        <div className="flex-1">
          <div className="min-h-[90vh] flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-8 text-center">
              
              {/* Main title */}
              <h1 className="text-6xl font-light mb-8 tracking-tight">
                The Transhumanist Forum
              </h1>
              
              <p className="serif text-lg text-muted-foreground leading-relaxed mb-12 max-w-lg mx-auto">
                A forum for rigorous discussion of human enhancement, the expansion of consciousness, 
                artificial intelligence, and the future of life itself.
              </p>
              
              {/* Call to action */}
              <div>
                {user ? (
                  <Link 
                    to="/forum"
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded border hover:bg-primary/90 crisp-transition shadow-subtle"
                  >
                    Enter Forum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link 
                    to="/forum"
                    className="inline-flex items-center px-6 py-3 border border-border bg-background text-foreground font-medium rounded hover:bg-muted crisp-transition shadow-subtle"
                  >
                    Browse Discussions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;