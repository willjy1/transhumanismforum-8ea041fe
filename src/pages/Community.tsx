import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';

const Community = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl">
          <div className="p-6">
            
            <div className="space-y-3 mb-16">
              <h1 className="text-large font-light">
                Community
              </h1>
              <p className="text-muted-foreground">
                Connect, share, and engage with fellow thinkers and philosophers
              </p>
            </div>

            {/* Community Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Notes Feature */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Share quick thoughts, observations, and insights with the community. 
                    Like Substack Notes - a social feed for philosophers and thinkers.
                  </p>
                  <Button asChild>
                    <Link to="/community/notes">
                      Explore Notes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Forum Link */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    Discussion Forum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Engage in deep discussions with detailed posts, comments, and threaded conversations.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/forum">
                      Visit Forum
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Events Section */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                  <h2 className="text-2xl font-light tracking-tight">Events</h2>
                </div>
                
                <div className="text-center py-20">
                  <h3 className="text-xl font-light mb-4">No Events Scheduled</h3>
                  <p className="text-muted-foreground">
                    Check back later for upcoming community events and workshops.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;