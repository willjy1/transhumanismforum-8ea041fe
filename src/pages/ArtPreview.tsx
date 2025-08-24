import React from 'react';
import conceptConsciousness from '@/assets/concept-consciousness-ascension.jpg';
import conceptLibrary from '@/assets/concept-enhanced-library.jpg';
import conceptAnatomy from '@/assets/concept-enhanced-anatomy.jpg';

const ArtPreview = () => {
  const artworks = [
    {
      title: "Consciousness Ascension",
      image: conceptConsciousness,
      description: "Renaissance technical drawing of human consciousness ascending through neural networks"
    },
    {
      title: "Enhanced Library", 
      image: conceptLibrary,
      description: "Classical baroque library with floating holographic books and DNA helixes"
    },
    {
      title: "Enhanced Anatomy",
      image: conceptAnatomy, 
      description: "da Vinci-inspired anatomical drawing showing brain-computer interfaces"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Art Concept Preview</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {artworks.map((artwork, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                <p className="text-muted-foreground">{artwork.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            These are concept artworks for the homepage. Navigate back to continue browsing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtPreview;