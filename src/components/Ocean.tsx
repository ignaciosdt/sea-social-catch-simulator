import { useEffect, useState } from "react";
import oceanBackground from "@/assets/ocean-background.jpg";

interface WaveProps {
  delay: number;
  size: number;
  x: number;
  y: number;
}

const Wave = ({ delay, size, x, y }: WaveProps) => (
  <div
    className="absolute rounded-full bg-gradient-wave opacity-30 animate-wave"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${delay}s`,
    }}
  />
);

export const Ocean = () => {
  const [waves, setWaves] = useState<WaveProps[]>([]);

  useEffect(() => {
    // Generate random waves
    const generateWaves = () => {
      const newWaves: WaveProps[] = [];
      for (let i = 0; i < 20; i++) {
        newWaves.push({
          delay: Math.random() * 3,
          size: 20 + Math.random() * 40,
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      }
      setWaves(newWaves);
    };

    generateWaves();
    const interval = setInterval(generateWaves, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ocean background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url(${oceanBackground})`
        }}
      />
      
      {/* Ocean gradient overlay */}
      <div className="absolute inset-0 bg-gradient-ocean opacity-80" />
      
      
      {/* Ocean grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--ocean-surface)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--ocean-surface)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

    </div>
  );
};