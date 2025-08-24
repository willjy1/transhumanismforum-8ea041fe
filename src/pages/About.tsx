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
          <div className="max-w-2xl mx-auto px-8 pt-16 pb-20">
            <div className="space-y-12">
              <div>
                <h1 className="text-4xl font-light tracking-tight mb-4">
                  About
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  A community dedicated to advancing human potential through technology, 
                  rational discourse, and ethical consideration of emerging possibilities.
                </p>
              </div>
              
              <div className="border-t border-border/50 pt-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium tracking-tight">
                      Our Mission
                    </h2>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      We believe that through careful application of science, technology, and reason, 
                      humanity can transcend current biological and psychological limitations. 
                      Our forum provides a space for thoughtful discussion about life extension, 
                      artificial intelligence, genetic enhancement, and the ethical implications 
                      of human enhancement technologies.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium tracking-tight">
                      Community Guidelines
                    </h2>
                    <div className="space-y-3">
                      {[
                        "Engage in respectful, evidence-based discussion",
                        "Consider multiple perspectives and potential consequences", 
                        "Focus on constructive dialogue rather than debate for its own sake",
                        "Share relevant research and credible sources",
                        "Be mindful of the ethical implications of proposed ideas"
                      ].map((guideline, index) => (
                        <p key={index} className="text-muted-foreground font-light leading-relaxed">
                          {guideline}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-8">
                    <div className="space-y-4">
                      <h2 className="text-xl font-medium tracking-tight">
                        Contact
                      </h2>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        For questions about the forum or to report issues, please reach out 
                        through our community channels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;