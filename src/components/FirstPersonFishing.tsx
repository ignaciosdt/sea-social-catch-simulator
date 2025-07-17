import { useEffect, useState } from "react";

interface FirstPersonFishingProps {
  isFishing: boolean;
  rotation: number;
}

export const FirstPersonFishing = ({ isFishing, rotation }: FirstPersonFishingProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [rodPosition, setRodPosition] = useState({ x: 70, y: 60 });
  const [time, setTime] = useState(Date.now() * 0.001);
  const boatSway = Math.sin(time * 0.8) * 0.5 + Math.cos(time * 0.6) * 0.3;

  // Update time for boat sway animation
  useEffect(() => {
    const updateTime = () => {
      setTime(Date.now() * 0.001);
    };
    
    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFishing) {
      // Create ripples when fishing
      const interval = setInterval(() => {
        const newRipple = {
          id: Date.now(),
          x: rodPosition.x + (Math.random() - 0.5) * 8,
          y: rodPosition.y + (Math.random() - 0.5) * 8,
          size: 15 + Math.random() * 25,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1800);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isFishing, rodPosition]);

  // Update rod position based on rotation and boat sway
  useEffect(() => {
    setRodPosition({
      x: 70 + rotation * 0.2 + boatSway * 2,
      y: 60 + Math.abs(rotation) * 0.08 + boatSway * 1.5,
    });
  }, [rotation, boatSway]);

  if (!isFishing) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fishing rod from first person view */}
      <div
        className="absolute w-1 bg-boat-wood origin-bottom transition-transform duration-200"
        style={{
          right: '15%',
          bottom: '12%',
          height: '35%',
          transform: `rotate(${25 + rotation * 0.3 + boatSway * 2}deg)`,
        }}
      />
      
      {/* Fishing rod handle */}
      <div
        className="absolute w-2 h-8 bg-boat-wood/80 rounded-full origin-bottom"
        style={{
          right: '14.5%',
          bottom: '10%',
          transform: `rotate(${25 + rotation * 0.3 + boatSway * 2}deg)`,
        }}
      />
      
      {/* Fishing line */}
      <div
        className="absolute w-px bg-foreground/70 origin-top"
        style={{
          right: `${28 - rotation * 0.2 + boatSway}%`,
          bottom: '40%',
          height: '22%',
          transform: `rotate(${rotation * 0.2 + boatSway * 0.5}deg)`,
          opacity: 0.8,
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
            opacity: 0.6,
          }}
        />
      ))}
      
      {/* Fishing indicator */}
      <div 
        className="absolute top-20 left-1/2 transform -translate-x-1/2"
        style={{
          transform: `translateX(-50%) rotate(${boatSway * 0.5}deg)`,
        }}
      >
        <div className="bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-ui">
          <span className="text-sm font-medium text-primary">🎣 Pescando...</span>
        </div>
      </div>
    </div>
  );
};