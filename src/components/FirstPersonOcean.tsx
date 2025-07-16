import { useEffect, useState } from "react";
import oceanBackground from "@/assets/ocean-background.jpg";

interface FirstPersonOceanProps {
  rotation: number;
  isMoving: boolean;
}

interface WaveProps {
  delay: number;
  size: number;
  x: number;
  y: number;
}

const Wave = ({ delay, size, x, y }: WaveProps) => (
  <div
    className="absolute rounded-full bg-gradient-wave opacity-20 animate-wave"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${delay}s`,
    }}
  />
);

export const FirstPersonOcean = ({ rotation, isMoving }: FirstPersonOceanProps) => {
  const [waves, setWaves] = useState<WaveProps[]>([]);

  useEffect(() => {
    // Generate waves in the distance
    const generateWaves = () => {
      const newWaves: WaveProps[] = [];
      for (let i = 0; i < 12; i++) {
        newWaves.push({
          delay: Math.random() * 3,
          size: 30 + Math.random() * 50,
          x: Math.random() * 100,
          y: 40 + Math.random() * 40, // Waves appear more in the distance
        });
      }
      setWaves(newWaves);
    };

    generateWaves();
    const interval = setInterval(generateWaves, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ocean background with perspective */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-300 ${
          isMoving ? 'scale-105' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url(${oceanBackground})`,
          transform: `rotate(${rotation * 0.1}deg) scale(${isMoving ? 1.05 : 1})`,
          backgroundPosition: `${50 + rotation * 0.2}% center`,
        }}
      />
      
      {/* Ocean gradient overlay with horizon */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-surface/30 via-ocean-surface/60 to-ocean-deep/90" />
      
      {/* Horizon line */}
      <div 
        className="absolute w-full h-px bg-ocean-foam/40 transition-transform duration-300"
        style={{
          top: '35%',
          transform: `rotate(${rotation * 0.15}deg)`,
        }}
      />
      
      {/* Distant waves */}
      {waves.map((wave, index) => (
        <Wave key={index} {...wave} />
      ))}
      
      {/* Water surface near the boat */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-ocean-surface/80 to-transparent">
        {/* Water ripples pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat-x animate-wave" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, hsl(var(--ocean-foam)) 2px, transparent 2px),
              radial-gradient(circle at 80% 60%, hsl(var(--ocean-foam)) 1px, transparent 1px),
              radial-gradient(circle at 40% 90%, hsl(var(--ocean-foam)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 40px, 80px 60px, 100px 50px',
            animationDuration: '6s',
          }} />
        </div>
      </div>
      
      {/* Boat edge at bottom (first person view) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-boat-wood/60 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-boat-wood/80 rounded-t-lg" />
      </div>
    </div>
  );
};