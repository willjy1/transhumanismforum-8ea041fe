import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Rocket, Infinity } from 'lucide-react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-l-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <MinimalSidebar />
        
        <main className="flex-1 relative overflow-hidden">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-subtle opacity-60"></div>
            
            <div className="relative max-w-7xl mx-auto px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* Content */}
                <div className="lg:col-span-7 space-y-12 animate-fade-up">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                    <Infinity className="h-4 w-4" />
                    The Future of Human Enhancement
                  </div>
                  
                  {/* Main headline */}
                  <div className="space-y-8">
                    <h1 className="text-display bg-gradient-primary bg-clip-text text-transparent">
                      Beyond
                      <br />
                      Humanity
                    </h1>
                    
                    <div className="space-y-6">
                      <p className="text-body text-muted-foreground max-w-2xl">
                        A forum for rigorous discussion of consciousness expansion, artificial intelligence, 
                        human enhancement, and the philosophical implications of transcending biological limitations.
                      </p>
                      
                      <p className="text-lg text-foreground/80 max-w-2xl">
                        Join thinkers, researchers, and visionaries exploring the intersection of 
                        technology, philosophy, and human potential.
                      </p>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                    <Link 
                      to="/forum"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold text-lg hover-lift hover:bg-accent/90 smooth-transition"
                    >
                      {user ? 'Enter Forum' : 'Browse Discussions'}
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 crisp-transition" />
                    </Link>
                    
                    <Link 
                      to="/concepts"
                      className="group inline-flex items-center justify-center px-8 py-4 border border-border rounded-lg font-semibold text-lg hover-lift hover:border-accent/50 smooth-transition"
                    >
                      Explore Concepts
                      <Brain className="h-5 w-5 ml-2 group-hover:scale-110 crisp-transition" />
                    </Link>
                  </div>
                  
                </div>
                
                {/* Visual Element */}
                <div className="lg:col-span-5 animate-fade-in">
                  <div className="relative">
                    {/* Abstract geometric visualization */}
                    <div className="relative w-full h-96 lg:h-[500px]">
                      
                      {/* Main orb */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-pulse"></div>
                          <div className="absolute inset-4 rounded-full bg-gradient-primary opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                          <div className="absolute inset-12 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        </div>
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-accent/20 animate-[bounce_3s_ease-in-out_infinite]"></div>
                      <div className="absolute top-3/4 right-1/4 w-8 h-8 rounded-full bg-primary/10 animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 right-1/3 w-6 h-6 rounded-full bg-accent/30 animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
                      
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(262 100% 65%)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(262 100% 75%)" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <path d="M 50 100 Q 200 150 350 100" stroke="url(#lineGradient)" strokeWidth="2" fill="none" opacity="0.6" />
                        <path d="M 100 50 Q 200 200 300 250" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" opacity="0.4" />
                        <path d="M 150 300 Q 250 100 400 200" stroke="url(#lineGradient)" strokeWidth="1" fill="none" opacity="0.3" />
                      </svg>
                      
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-24 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-8 lg:px-12">
              <div className="text-center space-y-6 mb-20">
                <h2 className="text-large">Explore the Future</h2>
                <p className="text-body text-muted-foreground max-w-3xl mx-auto">
                  Engage with cutting-edge ideas that challenge the boundaries of what it means to be human
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="interactive-card group">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 smooth-transition">
                    <Brain className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Consciousness Research</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dive deep into the nature of consciousness, exploring theories of mind, artificial sentience, and the hard problem of consciousness.
                  </p>
                </div>
                
                {/* Feature 2 */}
                <div className="interactive-card group">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 smooth-transition">
                    <Rocket className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Human Enhancement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Discuss biotechnology, cybernetics, and cognitive enhancement technologies that push the limits of human capability.
                  </p>
                </div>
                
                {/* Feature 3 */}
                <div className="interactive-card group">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 smooth-transition">
                    <Infinity className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">The Singularity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Examine the theoretical point where artificial intelligence surpasses human intelligence and fundamentally transforms civilization.
                  </p>
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