import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const Library = () => {
  const [concepts, setConcepts] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setConcepts(data || []);
    } catch (error) {
      console.error('Error fetching concepts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <div className="max-w-2xl mx-auto px-8 py-16">
              <div className="animate-pulse space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded"></div>
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
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-16">
            <h1 className="text-3xl font-light tracking-tight mb-3">
              Concepts
            </h1>
            <p className="text-muted-foreground mb-8">
              Core concepts in transhumanism and human enhancement
            </p>
          </div>

          {/* Clean Concepts List */}
          <div className="max-w-2xl mx-auto px-8 pb-20">
            <div className="space-y-6">
              {concepts.map((concept, index) => (
                <div 
                  key={concept.id}
                  className="animate-fade-in border-l-2 border-l-transparent hover:border-l-primary/50 crisp-transition pl-4 -ml-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h2 className="text-xl font-light tracking-tight hover:text-accent crisp-transition cursor-pointer py-2">
                    {concept.name}
                  </h2>
                  {concept.description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {concept.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;