import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const Concepts = () => {
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
      <div className="min-h-screen">
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
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-16">
            <h1 className="text-3xl font-light tracking-tight mb-8">
              Concepts
            </h1>
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
                  <Link to={`/concepts/${concept.id}`}>
                    <h2 className="text-xl font-light tracking-tight hover:text-accent crisp-transition cursor-pointer py-2">
                      {concept.name}
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Concepts;