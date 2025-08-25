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
        zIndex: 999,
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: '2px solid red'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'red',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        PATTERN TEST - Can you see this?
      </div>
    </div>
  );
};

export default PatternBackground;