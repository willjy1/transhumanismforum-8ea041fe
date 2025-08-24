import React, { useState } from 'react';
import { TrendingUp, Star, ThumbsUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const BestOf = () => {
  // Mock data for best content
  const topPosts = [
    {
      id: 1,
      title: "The Alignment Problem: Why AI Safety Matters More Than Speed",
      author: "alex_researcher",
      votes: 342,
      views: 5420,
      comments: 89,
      date: "2024-08-15",
      excerpt: "A comprehensive analysis of why rushing AI development without proper safety measures could be catastrophic..."
    },
    {
      id: 2, 
      title: "Longevity Escape Velocity: Are We Closer Than We Think?",
      author: "bio_optimist",
      votes: 287,
      views: 4180,
      comments: 64,
      date: "2024-08-10",
      excerpt: "Recent breakthroughs in cellular reprogramming suggest we might achieve significant life extension sooner..."
    },
    {
      id: 3,
      title: "Mind Uploading: Technical Challenges and Ethical Implications", 
      author: "consciousness_explorer",
      votes: 256,
      views: 3950,
      comments: 127,
      date: "2024-08-05",
      excerpt: "Examining the current state of research into digital consciousness and what it means for human identity..."
    }
  ];

  const topThinkers = [
    {
      name: "alex_researcher",
      reputation: 8420,
      posts: 45,
      contributions: "AI Safety Research"
    },
    {
      name: "bio_optimist", 
      reputation: 7150,
      posts: 38,
      contributions: "Longevity Science"
    },
    {
      name: "consciousness_explorer",
      reputation: 6890,
      posts: 52,
      contributions: "Philosophy of Mind"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-12 py-20">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Best Of
              </h1>
              <p className="text-muted-foreground">
                The most insightful discussions and valuable contributions to transhumanist discourse
              </p>
            </div>

            <Tabs defaultValue="posts" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="posts">Top Posts</TabsTrigger>
                <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                {topPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-medium leading-tight">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>by {post.author}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.votes} votes
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views} views
                        </div>
                        <span>{post.comments} comments</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="contributors" className="space-y-6">
                {topThinkers.map((thinker, index) => (
                  <Card key={thinker.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{thinker.name}</h3>
                              <p className="text-sm text-muted-foreground">{thinker.contributions}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{thinker.reputation}</span>
                            <span className="text-muted-foreground">reputation</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {thinker.posts} posts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default BestOf;