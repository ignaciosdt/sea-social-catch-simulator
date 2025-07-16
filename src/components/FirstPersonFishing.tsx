import { useEffect, useState } from "react";

interface FirstPersonFishingProps {
  isFishing: boolean;
  rotation: number;
}

export const FirstPersonFishing = ({ isFishing, rotation }: FirstPersonFishingProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [rodPosition, setRodPosition] = useState({ x: 70, y: 60 });

  useEffect(() => {
    if (isFishing) {
      // Create ripples when fishing
      const interval = setInterval(() => {
        const newRipple = {
          id: Date.now(),
          x: rodPosition.x + (Math.random() - 0.5) * 10,
          y: rodPosition.y + (Math.random() - 0.5) * 10,
          size: 20 + Math.random() * 30,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
      }, 400);

      return () => clearInterval(interval);
    }
  }, [isFishing, rodPosition]);

  // Update rod position based on rotation
  useEffect(() => {
    setRodPosition({
      x: 70 + rotation * 0.3,
      y: 60 + Math.abs(rotation) * 0.1,
    });
  }, [rotation]);

  if (!isFishing) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fishing rod from first person view */}
      <div
        className="absolute w-1 bg-boat-wood origin-bottom transition-transform duration-300"
        style={{
          right: '15%',
          bottom: '10%',
          height: '40%',
          transform: `rotate(${30 + rotation * 0.5}deg)`,
        }}
      />
      
      {/* Fishing line */}
      <div
        className="absolute w-px bg-foreground/80 animate-fishing-line origin-top"
        style={{
          right: `${30 - rotation * 0.3}%`,
          bottom: '35%',
          height: '25%',
          transform: `rotate(${rotation * 0.3}deg)`,
        }}
      />
      
      {/* Ripples in the water */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute border-2 border-ocean-foam rounded-full animate-ripple"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Fishing indicator */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <div className="bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-ui">
          <span className="text-sm font-medium text-primary">🎣 Pescando...</span>
        </div>
      </div>
    </div>
  );
};