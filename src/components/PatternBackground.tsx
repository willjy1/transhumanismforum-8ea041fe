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
        background: 'radial-gradient(circle at 30% 40%, rgba(100, 100, 100, 0.1) 0px, transparent 50%), radial-gradient(circle at 70% 60%, rgba(120, 120, 120, 0.08) 0px, transparent 60%)',
        opacity: 1
      }}
    />
  );
};

export default PatternBackground;