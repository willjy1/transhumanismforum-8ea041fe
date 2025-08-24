import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, ArrowUpRight, User, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Thinker {
  id: string;
  name: string;
  bio: string;
  field_of_expertise: string;
  key_works: string[];
  website_url: string | null;
  photo_url: string | null;
}

interface Book {
  title: string;
  author: string;
  description: string;
  year: number;
  url?: string;
}

interface Blog {
  title: string;
  author: string;
  description: string;
  url: string;
  category: string;
}

const Resources = () => {
  const [thinkers, setThinkers] = useState<Thinker[]>([]);
  const [loading, setLoading] = useState(true);

  const books: Book[] = [
    {
      title: "The Age of Em: Work, Love and Life When Robots Rule the Earth",
      author: "Robin Hanson",
      description: "A detailed analysis of a possible future where human minds are uploaded to computers, creating a society of digital beings.",
      year: 2016,
      url: "https://www.amazon.com/Age-Em-Work-Robots-Earth/dp/0198754620"
    },
    {
      title: "The Hedonistic Imperative",
      author: "David Pearce",
      description: "A philosophical exploration of how biotechnology might eliminate suffering and enhance well-being for all sentient life.",
      year: 1995,
      url: "https://www.hedweb.com/hedethic/hedonist.htm"
    },
    {
      title: "Homo Deus: A Brief History of Tomorrow",
      author: "Yuval Noah Harari",
      description: "An examination of humanity's future, exploring how technology and data might reshape human society and what it means to be human.",
      year: 2016,
      url: "https://www.amazon.com/Homo-Deus-Brief-History-Tomorrow/dp/0062464310"
    },
    {
      title: "Life 3.0: Being Human in the Age of Artificial Intelligence",
      author: "Max Tegmark",
      description: "A physicist's perspective on AI's potential impact on human civilization and how we can work to ensure AI remains beneficial.",
      year: 2017,
      url: "https://www.amazon.com/Life-3-0-Being-Artificial-Intelligence/dp/1101946598"
    },
    {
      title: "The Singularity Is Near",
      author: "Ray Kurzweil",
      description: "An exploration of the technological singularity and the exponential growth of technology, predicting the merger of human and artificial intelligence.",
      year: 2005,
      url: "https://www.amazon.com/Singularity-Near-Humans-Transcend-Biology/dp/0143037889"
    },
    {
      title: "Superintelligence: Paths, Dangers, Strategies",
      author: "Nick Bostrom",
      description: "A comprehensive examination of the risks and benefits of artificial superintelligence, exploring potential paths to its development and strategies for ensuring it benefits humanity.",
      year: 2014,
      url: "https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0198739834"
    },
    {
      title: "The Transhumanist Reader",
      author: "Max More & Natasha Vita-More (Eds.)",
      description: "A comprehensive anthology of transhumanist thought, featuring essays on human enhancement, life extension, and the philosophical foundations of transhumanism.",
      year: 2013,
      url: "https://www.amazon.com/Transhumanist-Reader-Classical-Contemporary-Transhumanism/dp/1118334310"
    }
  ];

  const blogs: Blog[] = [
    {
      title: "Gwern.net",
      author: "Gwern Branwen",
      description: "Deep statistical analysis and research on psychology, technology, genetics, and self-experimentation.",
      url: "https://www.gwern.net",
      category: "Research"
    },
    {
      title: "LessWrong",
      author: "Rationality Community",
      description: "A community blog focused on rationality, AI alignment, and effective altruism with discussions on human enhancement and existential risks.",
      url: "https://www.lesswrong.com",
      category: "Community"
    },
    {
      title: "Marginal Revolution",
      author: "Tyler Cowen & Alex Tabarrok",
      description: "Economics blog that frequently covers technological progress, human enhancement, and societal implications of emerging technologies.",
      url: "https://marginalrevolution.com",
      category: "Economics"
    },
    {
      title: "Overcoming Bias",
      author: "Robin Hanson",
      description: "Blog exploring cognitive biases, social dynamics, and unconventional thinking about human nature and society.",
      url: "http://www.overcomingbias.com",
      category: "Psychology"
    }
  ];

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="mb-16">
            <h1 className="text-4xl font-light tracking-tight">
              Resources
            </h1>
          </div>

          <div className="space-y-16">
            {/* Books Section */}
            <section>
              <h2 className="text-xl font-medium mb-8">Essential Reading</h2>
              
              <div className="space-y-6">
                {books.map((book, index) => (
                  <article 
                    key={`${book.title}-${book.author}`}
                    className="pb-6 border-b border-border/20 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {book.author} • {book.year}
                        </p>
                      </div>
                      
                      {book.url && (
                        <a 
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Blogs Section */}
            <section>
              <h2 className="text-xl font-medium mb-8">Blogs</h2>
              
              <div className="space-y-6">
                {blogs.map((blog, index) => (
                  <article 
                    key={blog.title}
                    className="pb-6 border-b border-border/20 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {blog.author}
                        </p>
                      </div>
                      
                      <a 
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {blog.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Thinkers Section */}
            <section>
              <h2 className="text-xl font-medium mb-8">Thinkers</h2>
              
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {thinkers.map((thinker, index) => (
                    <article 
                      key={thinker.id}
                      className="pb-8 border-b border-border/20 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">
                            {thinker.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {thinker.field_of_expertise}
                          </p>
                        </div>
                        
                        {thinker.website_url && (
                          <a 
                            href={thinker.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {thinker.bio}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;