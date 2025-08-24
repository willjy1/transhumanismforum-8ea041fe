import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const features = [
    {
      icon: Brain,
      title: "Deep Discussions",
      description: "Engage with cutting-edge ideas about consciousness, AI, and human potential"
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Connect with researchers, philosophers, and forward-thinking individuals"
    },
    {
      icon: BookOpen,
      title: "Curated Resources",
      description: "Access essential reading and research from leading transhumanist thinkers"
    }
  ];

  const stats = [
    { label: "Active Discussions", value: "1,200+" },
    { label: "Expert Contributors", value: "300+" },
    { label: "Research Papers", value: "500+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
            <div className="relative max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 fade-in-up">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Exploring the Future of Human Potential
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="font-display text-hero font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
                      The Transhumanist Forum
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                      A community dedicated to rigorous discussion about human enhancement, artificial intelligence, and the future of consciousness.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? (
                      <Button asChild size="lg" className="btn-primary group">
                        <Link to="/forum">
                          Explore Discussions
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="lg" className="btn-primary group">
                        <Link to="/auth">
                          Join Community
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                    
                    <Button asChild variant="ghost" size="lg" className="btn-ghost">
                      <Link to="/library">Browse Library</Link>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center space-y-1 animate-fade-up" style={{ animationDelay: `${(index + 1) * 0.2}s` }}>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative hidden lg:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-gradient-card rounded-3xl p-8 border border-border/50 backdrop-blur-sm">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">Live Discussion</span>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="text-sm font-medium mb-2">Current Topic</div>
                          <div className="text-xs text-muted-foreground">"The Ethics of Human Enhancement: Where Do We Draw the Line?"</div>
                        </div>
                        <div className="flex -space-x-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-background"></div>
                          ))}
                          <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs font-medium">+12</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Join Our Community?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Connect with like-minded individuals exploring the frontiers of human potential and technological advancement.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 stagger-children">
                {features.map((feature, index) => (
                  <div key={index} className="engagement-card p-6 text-center group hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Shape the Future?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join discussions that matter. Contribute to the conversation about humanity&apos;s next evolutionary step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user && (
                  <Button asChild size="lg" className="btn-primary">
                    <Link to="/auth">Get Started Today</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg" className="focus-ring">
                  <Link to="/resources">Explore Resources</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;