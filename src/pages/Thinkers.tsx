import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <MinimalSidebar />
          <main className="flex-1">
            <div className="max-w-2xl mx-auto px-8 py-16">
              <div className="space-y-16">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          {/* Minimal Header */}
          <div className="max-w-2xl mx-auto px-8 pt-16 pb-12">
            <h1 className="text-4xl font-light tracking-tight mb-4">
              Thinkers
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Voices shaping the future of humanity
            </p>
          </div>

          {/* Minimal Thinkers List */}
          <div className="max-w-2xl mx-auto px-8 pb-20">
            <div className="space-y-16">
              {thinkers.map((thinker, index) => (
                <article 
                  key={thinker.id}
                  className="group animate-fade-in border-b border-border/50 pb-16 last:border-b-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Name and Field */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-medium tracking-tight mb-2 group-hover:text-primary smooth-transition">
                        {thinker.name}
                      </h2>
                      <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                        {thinker.field_of_expertise}
                      </p>
                    </div>
                    
                    {thinker.website_url && (
                      <a 
                        href={thinker.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground smooth-transition group/link"
                      >
                        <span className="mr-1">Website</span>
                        <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 smooth-transition" />
                      </a>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="prose prose-neutral max-w-none mb-8">
                    <p className="text-foreground/80 leading-relaxed font-light text-[15px]">
                      {thinker.bio}
                    </p>
                  </div>

                  {/* Key Works - Minimal List */}
                  {thinker.key_works && thinker.key_works.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                        Notable Work
                      </h3>
                      <div className="space-y-2">
                        {thinker.key_works.slice(0, 3).map((work, workIndex) => (
                          <div 
                            key={workIndex}
                            className="text-sm text-muted-foreground/80 font-light italic leading-relaxed"
                          >
                            {work}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Empty State */}
            {thinkers.length === 0 && !loading && (
              <div className="text-center py-20">
                <h3 className="text-xl font-light text-muted-foreground mb-2">
                  No featured thinkers yet
                </h3>
                <p className="text-muted-foreground/80 font-light">
                  Coming soon
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Thinkers;