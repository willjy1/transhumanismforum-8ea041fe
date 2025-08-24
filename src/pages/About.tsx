import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            <div className="py-8">
              <h1 className="text-3xl font-medium text-gray-900 mb-8">About The Transhumanist Forum</h1>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The Transhumanist Forum is a community dedicated to advancing human potential through technology, rational discourse, and ethical consideration of emerging possibilities.
                </p>
                
                <h2 className="text-xl font-medium text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We believe that through careful application of science, technology, and reason, humanity can transcend current biological and psychological limitations. Our forum provides a space for thoughtful discussion about life extension, artificial intelligence, genetic enhancement, and the ethical implications of human enhancement technologies.
                </p>
                
                <h2 className="text-xl font-medium text-gray-900 mb-4">Community Guidelines</h2>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li>• Engage in respectful, evidence-based discussion</li>
                  <li>• Consider multiple perspectives and potential consequences</li>
                  <li>• Focus on constructive dialogue rather than debate for its own sake</li>
                  <li>• Share relevant research and credible sources</li>
                  <li>• Be mindful of the ethical implications of proposed ideas</li>
                </ul>
                
                <h2 className="text-xl font-medium text-gray-900 mb-4">Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about the forum or to report issues, please reach out through our community channels.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;