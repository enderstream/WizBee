import React, { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Animate the bee flying across the screen
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + 1,
        y: prev.y + Math.sin(prev.x / 10) * 2
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div 
        className="bee-logo" 
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`
        }}
      >
        {/* This would be your actual bee logo */}
        <div className="bee-body"></div>
        <div className="bee-wing"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;