import React from 'react';

const PatternBackground = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.025) 0%, transparent 50%),
          radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.15), transparent),
          radial-gradient(1px 1px at 40% 70%, rgba(255, 255, 255, 0.1), transparent),
          radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.12), transparent),
          radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.08), transparent),
          linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%)
        `,
        backgroundSize: '400px 400px, 600px 600px, 300px 300px, 100px 100px, 150px 150px, 80px 80px, 120px 120px, 60px 60px',
        animation: 'patternFloat 25s ease-in-out infinite, patternDrift 40s linear infinite'
      }}
    />
  );
};

export default PatternBackground;