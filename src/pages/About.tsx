import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-8 py-16">
            
            {/* Header */}
            <div className="mb-16">
              <h1 className="text-5xl font-normal mb-6">About</h1>
              <p className="serif text-xl text-muted-foreground leading-relaxed">
                A forum dedicated to rigorous discussion of human enhancement, artificial intelligence, 
                and the technological transformation of our species.
              </p>
            </div>
            
            <section className="mb-16">
              <h2 className="text-2xl font-normal mb-6 border-b border-border pb-2">
                Our Mission
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="serif text-muted-foreground leading-relaxed mb-6">
                  The Transhumanist Forum exists to advance rational discourse about humanity's technological future. 
                  We believe that through careful application of science, reason, and ethical consideration, 
                  we can overcome biological limitations and create a better world.
                </p>
                <p className="serif text-muted-foreground leading-relaxed mb-6">
                  Our community brings together researchers, philosophers, scientists, and curious individuals 
                  to explore questions that will define our species: How do we develop safe artificial intelligence? 
                  What are the ethical implications of human enhancement? How can we extend healthy human lifespan? 
                  What does it mean to be human in an age of radical technological capability?
                </p>
              </div>
            </section>

            {/* Principles */}
            <section className="mb-16">
              <h2 className="font-serif text-2xl font-normal mb-6 border-b border-border pb-2">
                Core Principles
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-lg mb-3">Evidence-Based Reasoning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We prioritize scientific evidence, logical analysis, and rigorous thinking over 
                    speculation or wishful thinking. Claims should be supported by data and reasoning.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Ethical Consideration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every technological capability raises moral questions. We examine both benefits 
                    and risks, considering impacts on individuals, society, and future generations.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Intellectual Humility</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We acknowledge uncertainty and complexity. The future is difficult to predict, 
                    and we remain open to revising our views based on new evidence.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Constructive Dialogue</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We engage in good faith with diverse perspectives, seeking understanding 
                    rather than victory in debate. Personal attacks and bad faith arguments are not tolerated.
                  </p>
                </div>
              </div>
            </section>

            {/* Community */}
            <section>
              <h2 className="font-serif text-2xl font-normal mb-6 border-b border-border pb-2">
                Community Guidelines
              </h2>
              <div className="bg-muted/30 rounded p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Engage respectfully with all community members</li>
                  <li>• Cite sources for factual claims when possible</li>
                  <li>• Consider multiple perspectives before forming conclusions</li>
                  <li>• Focus on ideas rather than personalities</li>
                  <li>• Acknowledge when you don't know something</li>
                  <li>• Report harmful content to moderators</li>
                </ul>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default About;