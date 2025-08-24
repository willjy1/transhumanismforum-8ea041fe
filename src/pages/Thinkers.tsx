import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Quote, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            <div className="py-8">
              <h1 className="text-3xl font-medium text-gray-900 mb-2">Featured Thinkers</h1>
              <p className="text-gray-600 mb-12">
                Influential voices shaping transhumanist thought and the future of humanity.
              </p>

              <div className="grid gap-8 lg:grid-cols-2">
                {thinkers.map((thinker) => (
                  <Card key={thinker.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">{thinker.name}</h3>
                          <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-700">
                            {thinker.field_of_expertise}
                          </Badge>
                        </div>
                        
                        {thinker.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={thinker.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {thinker.bio}
                      </p>
                      
                      {thinker.key_works && thinker.key_works.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Key Works
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {thinker.key_works.map((work, index) => (
                              <li key={index}>• {work}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {thinker.quotes && thinker.quotes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Quote className="h-4 w-4 mr-2" />
                            Quote
                          </h4>
                          <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-700">
                            "{thinker.quotes[0]}"
                          </blockquote>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {thinkers.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No featured thinkers yet</h3>
                  <p className="text-gray-600">
                    Featured thinkers will appear here to showcase influential voices in transhumanism.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Thinkers;