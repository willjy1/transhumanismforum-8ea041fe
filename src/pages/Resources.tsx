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

          <div className="space-y-20">
            {/* Books Section */}
            <section>
              <div className="flex items-center gap-3 mb-12">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-2xl font-light tracking-tight">Essential Reading</h2>
              </div>
              
              <div className="space-y-8">
                {books.map((book, index) => (
                  <article 
                    key={`${book.title}-${book.author}`}
                    className="group animate-fade-in pb-8 border-b border-border/30 last:border-b-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium tracking-tight mb-1 group-hover:text-primary smooth-transition">
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
                          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground smooth-transition group/link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed font-light text-sm">
                      {book.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Blogs Section */}
            <section>
              <div className="flex items-center gap-3 mb-12">
                <Globe className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-2xl font-light tracking-tight">Recommended Blogs</h2>
              </div>
              
              <div className="space-y-8">
                {blogs.map((blog, index) => (
                  <article 
                    key={blog.title}
                    className="group animate-fade-in pb-8 border-b border-border/30 last:border-b-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium tracking-tight group-hover:text-primary smooth-transition">
                            {blog.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            {blog.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {blog.author}
                        </p>
                      </div>
                      
                      <a 
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground smooth-transition group/link"
                      >
                        <span className="mr-1">Visit</span>
                        <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 smooth-transition" />
                      </a>
                    </div>

                    <p className="text-muted-foreground leading-relaxed font-light text-sm">
                      {blog.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Thinkers Section */}
            <section>
              <div className="flex items-center gap-3 mb-12">
                <User className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-2xl font-light tracking-tight">Featured Thinkers</h2>
              </div>
              
              {loading ? (
                <div className="space-y-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-12">
                  {thinkers.map((thinker, index) => (
                    <article 
                      key={thinker.id}
                      className="group animate-fade-in pb-12 border-b border-border/30 last:border-b-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:text-primary smooth-transition">
                            {thinker.name}
                          </h3>
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

                      <p className="text-muted-foreground leading-relaxed font-light text-[15px] mb-6">
                        {thinker.bio}
                      </p>

                      {thinker.key_works && thinker.key_works.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-3">
                            Notable Work
                          </h4>
                          <div className="space-y-2">
                            {thinker.key_works.slice(0, 2).map((work, workIndex) => (
                              <div 
                                key={workIndex}
                                className="text-sm text-muted-foreground/80 font-light italic"
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
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;