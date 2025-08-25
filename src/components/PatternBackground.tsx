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
        background: `
          radial-gradient(circle at 20% 30%, rgba(120, 120, 120, 0.15) 0px, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(100, 100, 100, 0.12) 0px, transparent 60%),
          radial-gradient(circle at 60% 20%, rgba(140, 140, 140, 0.18) 0px, transparent 40%),
          radial-gradient(circle at 30% 80%, rgba(110, 110, 110, 0.1) 0px, transparent 55%),
          radial-gradient(circle at 90% 40%, rgba(130, 130, 130, 0.14) 0px, transparent 45%)
        `,
        animation: 'floatPattern 20s ease-in-out infinite'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            radial-gradient(2px 2px at 25% 35%, rgba(120, 120, 120, 0.4), transparent),
            radial-gradient(1px 1px at 45% 75%, rgba(110, 110, 110, 0.3), transparent),
            radial-gradient(2px 2px at 65% 25%, rgba(130, 130, 130, 0.35), transparent),
            radial-gradient(1px 1px at 85% 55%, rgba(100, 100, 100, 0.25), transparent)
          `,
          backgroundSize: '150px 150px, 100px 100px, 120px 120px, 80px 80px',
          backgroundPosition: '0 0, 30px 40px, 15px 15px, 50px 25px',
          animation: 'movePattern 30s linear infinite'
        }}
      />
    </div>
  );
};

export default PatternBackground;