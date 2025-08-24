import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Brain, Plus } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          {/* Hero Section */}
          <section className="py-16 px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-display font-bold tracking-tight">
                  The Transhumanist Forum
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  A community dedicated to rigorous discussion about human enhancement, 
                  artificial intelligence, and the future of consciousness.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Button asChild size="lg">
                      <Link to="/forum">
                        Explore Discussions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/create-post-rich">
                        <Plus className="h-4 w-4" />
                        Create Post
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link to="/auth">
                        Join Community
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/library">Browse Library</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 px-8 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold mb-4">Why Join Our Community?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Connect with like-minded individuals exploring the frontiers of human potential.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="interactive-card text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;