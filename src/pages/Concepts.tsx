import React, { useState } from 'react';
import { Search, Zap, ExternalLink, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Concepts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock concepts data
  const concepts = [
    {
      id: 1,
      title: "Technological Singularity",
      definition: "A hypothetical future point in time when technological growth becomes uncontrollable and irreversible, resulting in unforeseeable changes to human civilization.",
      category: "AI & Computing",
      relatedTerms: ["Intelligence Explosion", "AGI", "Superintelligence"],
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Longevity Escape Velocity",
      definition: "The theoretical point where life extension technology advances fast enough that human lifespan increases by more than one year per year of research.",
      category: "Life Extension", 
      relatedTerms: ["SENS", "Aging Research", "Regenerative Medicine"],
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Existential Risk",
      definition: "Risks that threaten the survival of humanity or the permanent curtailment of human potential, including but not limited to nuclear war, climate change, and unaligned AI.",
      category: "Risk Assessment",
      relatedTerms: ["Global Catastrophic Risk", "X-Risk", "Alignment Problem"],
      difficulty: "Intermediate"
    },
    {
      id: 4,
      title: "Mind Uploading",
      definition: "The theoretical process of copying or transferring a mind from a biological brain to an artificial substrate, preserving mental processes and consciousness.",
      category: "Consciousness",
      relatedTerms: ["Substrate Independence", "Digital Immortality", "Whole Brain Emulation"],
      difficulty: "Advanced"
    },
    {
      id: 5,
      title: "Enhancement vs. Treatment",
      definition: "The ethical distinction between medical interventions that restore normal function versus those that improve capabilities beyond the typical human range.",
      category: "Ethics",
      relatedTerms: ["Bioethics", "Human Enhancement", "Therapy Enhancement Distinction"],
      difficulty: "Intermediate"
    },
    {
      id: 6,
      title: "Friendly AI",
      definition: "Artificial intelligence systems that are designed to be beneficial to humanity, aligned with human values, and safe even as they become superintelligent.",
      category: "AI Safety",
      relatedTerms: ["Value Alignment", "AI Control", "Cooperative AI"],
      difficulty: "Advanced"
    }
  ];

  const categories = [...new Set(concepts.map(c => c.category))];

  const filteredConcepts = concepts.filter(concept =>
    concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.relatedTerms.some(term => term.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';  
      case 'Advanced': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-20">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Concepts
              </h1>
              <p className="text-muted-foreground">
                Key terms and ideas in transhumanist thought and emerging technologies
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-12">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>

            {/* Category Overview */}
            <div className="mb-12">
              <h2 className="text-lg font-light mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="outline" className="cursor-pointer hover:bg-accent">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Concepts Grid */}
            <div className="space-y-6">
              {filteredConcepts.map((concept) => (
                <Card key={concept.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          {concept.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{concept.category}</Badge>
                          <Badge className={`border ${getDifficultyColor(concept.difficulty)}`} variant="outline">
                            {concept.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {concept.definition}
                    </p>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Related Terms:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {concept.relatedTerms.map((term) => (
                          <Badge key={term} variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredConcepts.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No concepts found matching "{searchTerm}".
                </p>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Concepts;