import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Zap, Users, BookOpen, MessageCircle, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Index = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <MinimalSidebar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-bg">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Brain className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">The Future of Humanity</span>
                </div>
                
                <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                  The Transhumanist Forum
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join the conversation about human enhancement, longevity research, artificial intelligence, 
                  and the technologies that will shape our species' future.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user ? (
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-glow">
                      <Link to="/forum">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Enter Forum
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-glow">
                        <Link to="/auth">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                        <Link to="/forum">Browse Discussions</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl font-bold mb-4">Explore the Future</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Dive deep into the topics that will define humanity's next evolutionary step
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Zap,
                    title: "Human Enhancement",
                    description: "Genetic engineering, cybernetics, and cognitive augmentation technologies"
                  },
                  {
                    icon: Brain,
                    title: "AI & Consciousness", 
                    description: "Artificial intelligence, neural interfaces, and the nature of digital minds"
                  },
                  {
                    icon: TrendingUp,
                    title: "Longevity Research",
                    description: "Life extension science, aging reversal, and the path to biological immortality"
                  },
                  {
                    icon: Users,
                    title: "Community",
                    description: "Connect with researchers, philosophers, and fellow transhumanists worldwide"
                  },
                  {
                    icon: BookOpen,
                    title: "Knowledge Base",
                    description: "Curated sequences and resources on complex transhumanist topics"
                  },
                  {
                    icon: MessageCircle,
                    title: "Open Discussion",
                    description: "Share ideas, debate concepts, and shape the future of our species"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="elegant-shadow hover:shadow-glow smooth-transition group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 smooth-transition">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 gradient-bg">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-3xl font-bold mb-6">Ready to Shape the Future?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of forward-thinking individuals exploring humanity's potential
              </p>
              
              {!user && (
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-glow">
                  <Link to="/auth">
                    Join the Community
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
