import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Quote, BookOpen } from 'lucide-react';

interface Thinker {
  id: string;
  name: string;
  bio: string;
  photo_url: string | null;
  website_url: string | null;
  key_works: string[];
  quotes: string[];
  field_of_expertise: string;
  display_order: number;
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
        .order('display_order', { ascending: true });

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
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Featured Thinkers</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the minds that have shaped transhumanist thought and continue to push the boundaries of human potential.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {thinkers.map((thinker) => (
          <Card key={thinker.id} className="overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                {thinker.photo_url ? (
                  <img
                    src={thinker.photo_url}
                    alt={thinker.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {thinker.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <CardTitle className="text-2xl">{thinker.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {thinker.field_of_expertise}
                  </Badge>
                </div>
                
                {thinker.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={thinker.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {thinker.bio}
              </p>
              
              {thinker.key_works && thinker.key_works.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Key Works
                  </h4>
                  <ul className="space-y-1">
                    {thinker.key_works.map((work, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {work}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {thinker.quotes && thinker.quotes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Quote className="h-4 w-4 mr-2" />
                    Notable Quote
                  </h4>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "{thinker.quotes[0]}"
                  </blockquote>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {thinkers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No featured thinkers yet</h3>
            <p className="text-muted-foreground">
              Featured thinkers will appear here to showcase influential voices in transhumanism.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Thinkers;