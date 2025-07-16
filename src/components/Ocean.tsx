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
      
      {/* Animated waves */}
      {waves.map((wave, index) => (
        <Wave key={index} {...wave} />
      ))}
      
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

      {/* Floating debris */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-boat-wood rounded-full opacity-60 animate-wave" />
      <div className="absolute top-40 right-32 w-2 h-2 bg-boat-wood rounded-full opacity-40 animate-wave" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-boat-wood rounded-full opacity-50 animate-wave" style={{ animationDelay: '2s' }} />
      
      {/* Distant islands */}
      <div className="absolute top-10 right-10 w-16 h-8 bg-accent rounded-full opacity-30" />
      <div className="absolute bottom-20 left-10 w-12 h-6 bg-accent rounded-full opacity-20" />
    </div>
  );
};