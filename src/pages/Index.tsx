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
                <h1 className="font-serif text-6xl font-normal tracking-tight text-foreground mb-8 leading-tight">
                  The Transhumanist Forum
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                  A scholarly community dedicated to the rigorous examination of human enhancement, 
                  artificial intelligence, consciousness, and the technological transformation of our species.
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
              
              {/* Academic mission statement */}
              <section className="mt-20 pt-16 border-t border-border text-left">
                <div className="grid md:grid-cols-3 gap-12 text-sm">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Rigorous Discussion</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Evidence-based conversations about emerging technologies, 
                      philosophical implications, and ethical considerations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Scholarly Community</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Researchers, academics, and thoughtful individuals exploring 
                      the future of human enhancement and artificial intelligence.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Open Inquiry</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Interdisciplinary dialogue bridging technology, philosophy, 
                      biology, and ethics in the study of human potential.
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;