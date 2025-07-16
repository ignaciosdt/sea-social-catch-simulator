import { useEffect, useState } from "react";
import { Position } from "./FishingSimulator";

interface FishingMechanicsProps {
  isFishing: boolean;
  position: Position;
}

export const FishingMechanics = ({ isFishing, position }: FishingMechanicsProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isFishing) {
      // Create ripples when fishing
      const interval = setInterval(() => {
        const newRipple = {
          id: Date.now(),
          x: position.x + (Math.random() - 0.5) * 40,
          y: position.y + 20 + (Math.random() - 0.5) * 20,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1000);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isFishing, position]);

  if (!isFishing) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fishing line */}
      <div
        className="absolute w-px h-12 bg-foreground animate-fishing-line"
        style={{
          left: `${position.x + 20}px`,
          top: `${position.y + 10}px`,
        }}
      />
      
      {/* Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute w-4 h-4 border-2 border-ocean-foam rounded-full animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Fishing indicator */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 60}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-ui">
          <span className="text-sm font-medium text-primary">🎣 Pescando...</span>
        </div>
      </div>
    </div>
  );
};