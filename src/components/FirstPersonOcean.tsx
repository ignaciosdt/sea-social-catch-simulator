
import { useEffect, useState } from "react";
import oceanBackground from "@/assets/ocean-background.jpg";

interface FirstPersonOceanProps {
  rotation: number;
  position: { x: number; y: number; z: number };
  isMoving: boolean;
}

interface WaterParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export const FirstPersonOcean = ({ rotation, position, isMoving }: FirstPersonOceanProps) => {
  const [waterParticles, setWaterParticles] = useState<WaterParticle[]>([]);

  useEffect(() => {
    // Generate flowing water particles instead of circular waves
    const generateParticles = () => {
      const newParticles: WaterParticle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: 60 + Math.random() * 30,
          size: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.4,
          speed: 0.5 + Math.random() * 1,
        });
      }
      setWaterParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setWaterParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speed) % 100,
          y: particle.y + Math.sin(Date.now() * 0.001 + particle.id) * 0.5,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const depthEffect = Math.min(position.z * 0.1, 1);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ocean background with depth and movement */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
          isMoving ? 'scale-110' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url(${oceanBackground})`,
          transform: `
            translateX(${position.x * -0.5}px) 
            translateY(${position.y * -0.3}px) 
            rotate(${rotation * 0.1}deg) 
            scale(${isMoving ? 1.1 : 1})
          `,
          filter: `blur(${depthEffect * 2}px) brightness(${1 - depthEffect * 0.3})`,
        }}
      />
      
      {/* Dynamic ocean gradient based on depth */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(
            to bottom,
            hsl(var(--ocean-surface) / ${0.2 + depthEffect * 0.3}) 0%,
            hsl(var(--ocean-surface) / ${0.4 + depthEffect * 0.4}) 30%,
            hsl(var(--ocean-deep) / ${0.6 + depthEffect * 0.3}) 70%,
            hsl(var(--ocean-deep) / ${0.8 + depthEffect * 0.2}) 100%
          )`
        }}
      />
      
      {/* Horizon line that moves with rotation */}
      <div 
        className="absolute w-full h-px bg-ocean-foam/30 transition-all duration-300"
        style={{
          top: `${35 + position.y * 0.1}%`,
          transform: `rotate(${rotation * 0.2}deg)`,
          opacity: Math.max(0.1, 1 - depthEffect),
        }}
      />
      
      {/* Flowing water particles (no circles) */}
      {waterParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-ocean-foam transition-all duration-100"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `1px`,
            opacity: particle.opacity * (1 - depthEffect * 0.5),
            transform: `rotate(${rotation * 0.1 + particle.id * 10}deg)`,
          }}
        />
      ))}
      
      {/* Water surface texture */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 overflow-hidden">
        <div 
          className="w-full h-full opacity-20 transition-all duration-500"
          style={{
            background: `
              linear-gradient(
                ${90 + rotation * 0.5}deg, 
                transparent 0%, 
                hsl(var(--ocean-foam) / 0.1) 20%, 
                transparent 40%,
                hsl(var(--ocean-foam) / 0.1) 60%,
                transparent 80%
              )
            `,
            transform: `translateX(${position.x * -0.2}px) translateY(${position.y * -0.1}px)`,
          }}
        />
      </div>
      
      {/* Underwater effect when deep */}
      {depthEffect > 0.5 && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 20%,
              hsl(var(--ocean-deep) / 0.3) 60%,
              hsl(var(--ocean-deep) / 0.6) 100%
            )`,
            opacity: (depthEffect - 0.5) * 2,
          }}
        />
      )}
      
      {/* Boat edge (first person view) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-boat-wood/40 to-transparent">
        <div 
          className="absolute bottom-0 left-0 right-0 h-3 bg-boat-wood/60 transition-all duration-300"
          style={{
            transform: `rotate(${rotation * 0.05}deg)`,
          }}
        />
      </div>
    </div>
  );
};
