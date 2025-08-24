import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Events = () => {
  // Mock events data for now
  const upcomingEvents = [
    {
      id: 1,
      title: "AI Alignment Workshop",
      date: "2024-09-15",
      time: "14:00",
      location: "Online",
      attendees: 45,
      description: "Deep dive into current AI safety research and alignment strategies."
    },
    {
      id: 2,
      title: "Longevity Research Symposium", 
      date: "2024-09-22",
      time: "10:00",
      location: "San Francisco, CA",
      attendees: 128,
      description: "Latest developments in life extension and aging research."
    },
    {
      id: 3,
      title: "Consciousness & Computation Panel",
      date: "2024-10-05",
      time: "18:00", 
      location: "Online",
      attendees: 67,
      description: "Exploring the nature of consciousness in biological and artificial systems."
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
                Events
              </h1>
              <p className="text-muted-foreground">
                Workshops, conferences, and gatherings for the transhumanist community
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-light mb-6">Upcoming Events</h2>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {event.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Want to organize an event? Contact the community moderators.
                </p>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;