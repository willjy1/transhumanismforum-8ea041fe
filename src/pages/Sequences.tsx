import React from 'react';
import Header from '@/components/Header';
import MinimalSidebar from '@/components/MinimalSidebar';

const Sequences = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <MinimalSidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-16">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">Sequences</h1>
              <div className="max-w-2xl mx-auto text-left">
                <p className="text-gray-600 mb-6">
                  Sequences are curated series of posts that explore complex transhumanist topics in depth. 
                  Each sequence builds concepts progressively, designed to be read in order.
                </p>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="border-l-4 border-blue-200 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 mb-1">Planned Sequences:</h3>
                    <ul className="space-y-1">
                      <li>• <strong>Life Extension Fundamentals</strong> - Biology, medicine, and the science of aging</li>
                      <li>• <strong>AI Safety & Alignment</strong> - Ensuring beneficial artificial intelligence</li>
                      <li>• <strong>Enhancement Ethics</strong> - Moral considerations in human improvement</li>
                      <li>• <strong>Cryonics: Theory & Practice</strong> - Preservation science and protocols</li>
                      <li>• <strong>The Economics of Immortality</strong> - Societal implications of life extension</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-6">
                  Sequences will be published as the community grows and expert contributors develop comprehensive content series.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sequences;