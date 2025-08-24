import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';

const Library = () => {
  const concepts = [
    {
      title: "Artificial General Intelligence",
      description: "Machine intelligence that matches or exceeds human cognitive abilities across all domains",
      category: "AI & Computing"
    },
    {
      title: "Longevity Escape Velocity", 
      description: "The point at which life extension therapies add more than one year of life per year",
      category: "Life Extension"
    },
    {
      title: "Technological Singularity",
      description: "A hypothetical future point when technological growth becomes uncontrollable and irreversible",
      category: "Futurism"
    },
    {
      title: "Morphological Freedom",
      description: "The right to modify one's body, cognitively or physically, through technological means",
      category: "Ethics & Philosophy"
    },
    {
      title: "Mind Uploading",
      description: "The hypothetical process of transferring human consciousness to a digital substrate",
      category: "Consciousness"
    },
    {
      title: "Cryonics",
      description: "Preservation of humans at low temperatures with the hope of future revival",
      category: "Life Extension"
    },
    {
      title: "Friendly AI",
      description: "Artificial intelligence designed to be beneficial to humanity and aligned with human values",
      category: "AI & Computing"
    },
    {
      title: "Nootropics",
      description: "Substances that enhance cognitive function, memory, creativity, or motivation",
      category: "Enhancement"
    },
    {
      title: "Posthumanism",
      description: "A philosophical position that challenges traditional humanist assumptions about human nature",
      category: "Ethics & Philosophy"
    }
  ];

  const resources = [
    {
      title: "The Sequences",
      author: "Eliezer Yudkowsky", 
      description: "Foundational essays on rationality, cognitive biases, and AI alignment",
      url: "https://www.readthesequences.com/"
    },
    {
      title: "Superintelligence",
      author: "Nick Bostrom",
      description: "Analysis of the strategic implications of machine superintelligence",
      url: "#"
    },
    {
      title: "Life Extension FAQ",
      author: "Aubrey de Grey",
      description: "Comprehensive answers about aging research and life extension",
      url: "#"
    },
    {
      title: "Transhumanist Declaration",
      author: "Humanity+",
      description: "Core principles and values of the transhumanist movement",
      url: "#"
    }
  ];

  const categories = [...new Set(concepts.map(c => c.category))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            
            {/* Header */}
            <div className="mb-16">
              <h1 className="font-serif text-5xl font-normal mb-6">Library</h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                Essential concepts, resources, and foundational texts for understanding 
                transhumanism, artificial intelligence, and human enhancement.
              </p>
            </div>

            {/* Key Concepts */}
            <section className="mb-16">
              <h2 className="font-serif text-2xl font-normal mb-8 border-b border-border pb-2">
                Key Concepts
              </h2>
              
              <div className="space-y-8">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-accent uppercase tracking-wide mb-4">
                      {category}
                    </h3>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      {concepts.filter(c => c.category === category).map((concept, index) => (
                        <div key={concept.title} className="bg-card border border-border rounded p-6 hover:shadow-medium crisp-transition">
                          <h4 className="font-serif text-lg font-medium mb-3">{concept.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{concept.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Essential Reading */}
            <section>
              <h2 className="font-serif text-2xl font-normal mb-8 border-b border-border pb-2">
                Essential Reading
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {resources.map((resource, index) => (
                  <div key={resource.title} className="bg-card border border-border rounded p-6 hover:shadow-medium crisp-transition">
                    <div className="flex items-start justify-between mb-3">
                      <BookOpen className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h4 className="font-serif text-lg font-medium mb-2">{resource.title}</h4>
                    <p className="text-sm text-accent mb-3">{resource.author}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{resource.description}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;