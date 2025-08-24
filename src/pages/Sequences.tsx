import React from 'react';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Sequences = () => {
  // Mock sequences data
  const sequences = [
    {
      id: 1,
      title: "Foundations of Rationality",
      author: "eliezer_yudkowsky",
      posts: 12,
      readingTime: "4 hours",
      description: "Core concepts for clear thinking and decision-making in an uncertain world.",
      topics: ["Cognitive Bias", "Probability", "Decision Theory"],
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "The AI Alignment Problem", 
      author: "stuart_russell",
      posts: 8,
      readingTime: "2.5 hours",
      description: "Understanding why creating aligned artificial intelligence is crucial for human survival.",
      topics: ["AI Safety", "Value Alignment", "Control Problem"],
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Transhumanist Philosophy",
      author: "nick_bostrom",
      posts: 15,
      readingTime: "6 hours", 
      description: "Exploring the ethical and philosophical implications of human enhancement technologies.",
      topics: ["Enhancement Ethics", "Future of Humanity", "Technology Ethics"],
      difficulty: "Advanced"
    },
    {
      id: 4,
      title: "Longevity Science Deep Dive",
      author: "aubrey_de_grey",
      posts: 10,
      readingTime: "3.5 hours",
      description: "Comprehensive overview of aging research and life extension strategies.",
      topics: ["SENS", "Cellular Aging", "Regenerative Medicine"],
      difficulty: "Intermediate"
    }
  ];

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
                Sequences
              </h1>
              <p className="text-muted-foreground">
                Curated series of posts that build understanding of key transhumanist concepts
              </p>
            </div>

            <div className="space-y-8">
              {sequences.map((sequence) => (
                <Card key={sequence.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {sequence.title}
                          </CardTitle>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {sequence.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {sequence.posts} posts
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {sequence.readingTime}
                          </div>
                        </div>
                      </div>
                      <Badge className={`border ${getDifficultyColor(sequence.difficulty)}`} variant="outline">
                        {sequence.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {sequence.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sequence.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center py-12 mt-16">
              <p className="text-muted-foreground">
                Want to create a sequence? Share your expertise with the community.
              </p>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sequences;