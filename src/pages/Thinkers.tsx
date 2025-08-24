import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Brain, Users, BookOpen, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

interface Thinker {
  id: string;
  name: string;
  bio: string;
  field_of_expertise: string;
  key_works: string[];
  website_url: string | null;
  photo_url: string | null;
}

const Thinkers = () => {
  const [thinkers, setThinkers] = useState<Thinker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThinkers();
  }, []);

  const fetchThinkers = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_thinkers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setThinkers(data || []);
    } catch (error) {
      console.error('Error fetching thinkers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted rounded-xl animate-pulse elegant-shadow"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
            <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                <Brain className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Visionary Minds</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
                Featured Thinkers
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
                Pioneering researchers, philosophers, and visionaries shaping the future of humanity through 
                science, technology, and transformative ideas.
              </p>
            </div>
          </section>

          {/* Thinkers Grid */}
          <section className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {thinkers.map((thinker, index) => (
                <Card 
                  key={thinker.id} 
                  className="group elegant-shadow hover:shadow-glow smooth-transition overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {/* Header with gradient */}
                    <div className="h-24 bg-gradient-primary relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-glow/60"></div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <h2 className="text-xl font-bold text-white mb-1 group-hover:scale-105 smooth-transition">
                          {thinker.name}
                        </h2>
                      </div>
                    </div>

                    {/* Profile Image Placeholder */}
                    <div className="absolute -bottom-6 left-6">
                      <div className="w-12 h-12 rounded-full bg-card border-4 border-card flex items-center justify-center elegant-shadow">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="pt-10 pb-6 space-y-4">
                    {/* Field of Expertise Badge */}
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 smooth-transition">
                      {thinker.field_of_expertise}
                    </Badge>

                    {/* Bio */}
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {thinker.bio}
                    </p>

                    {/* Key Works */}
                    {thinker.key_works && thinker.key_works.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>Key Contributions</span>
                        </div>
                        <div className="space-y-2">
                          {thinker.key_works.slice(0, 3).map((work, workIndex) => (
                            <div 
                              key={workIndex}
                              className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border-l-2 border-primary/20"
                            >
                              {work}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website Link */}
                    {thinker.website_url && (
                      <div className="pt-4 border-t border-border">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full group/btn hover:bg-primary/5 hover:border-primary/40 smooth-transition"
                        >
                          <a 
                            href={thinker.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 smooth-transition" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {thinkers.length === 0 && !loading && (
              <Card className="elegant-shadow max-w-md mx-auto">
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">No Featured Thinkers</h3>
                  <p className="text-muted-foreground">
                    Featured thinkers will appear here as they are added to showcase the minds 
                    shaping our transhuman future.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Thinkers;