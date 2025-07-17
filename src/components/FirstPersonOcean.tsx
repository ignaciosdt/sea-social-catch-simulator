
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

  const depthEffect = Math.min(position.z * 0.01, 1);
  const time = Date.now() * 0.001;
  const boatSway = Math.sin(time * 0.8) * 0.3 + Math.cos(time * 0.6) * 0.2;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Infinite ocean background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-200"
        style={{
          backgroundImage: `url(${oceanBackground})`,
          transform: `
            translateX(${position.x * -0.8}px) 
            translateY(${position.y * -0.8}px) 
            rotate(${rotation * 0.3}deg) 
            scale(${1.2 + depthEffect * 0.2})
          `,
          filter: `blur(${depthEffect * 3}px) brightness(${1 - depthEffect * 0.5})`,
        }}
      />
      
      {/* Infinite tiled ocean pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            repeating-linear-gradient(
              ${rotation + 45}deg,
              transparent 0px,
              hsl(var(--ocean-surface) / 0.1) 100px,
              transparent 200px
            ),
            repeating-linear-gradient(
              ${rotation - 45}deg,
              transparent 0px,
              hsl(var(--ocean-surface) / 0.1) 150px,
              transparent 300px
            )
          `,
          transform: `translateX(${position.x * -0.3}px) translateY(${position.y * -0.3}px)`,
        }}
      />
      
      {/* Dynamic ocean gradient based on depth */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(
            to bottom,
            hsl(var(--ocean-surface) / ${0.1 + depthEffect * 0.2}) 0%,
            hsl(var(--ocean-surface) / ${0.3 + depthEffect * 0.3}) 40%,
            hsl(var(--ocean-deep) / ${0.4 + depthEffect * 0.4}) 70%,
            hsl(var(--ocean-deep) / ${0.6 + depthEffect * 0.4}) 100%
          )`
        }}
      />
      
      {/* Horizon line that moves with rotation */}
      <div 
        className="absolute w-full h-px bg-ocean-foam/20 transition-all duration-200"
        style={{
          top: `${40 + position.y * 0.05 + boatSway}%`,
          transform: `rotate(${rotation * 0.8}deg)`,
          opacity: Math.max(0.1, 1 - depthEffect * 2),
        }}
      />
      
      {/* Flowing water particles */}
      {waterParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-ocean-foam transition-all duration-100"
          style={{
            left: `${(particle.x + position.x * 0.1) % 100}%`,
            top: `${particle.y + boatSway * 0.5}%`,
            width: `${particle.size}px`,
            height: `1px`,
            opacity: particle.opacity * (1 - depthEffect * 0.7),
            transform: `rotate(${rotation * 0.2 + particle.id * 15}deg)`,
          }}
        />
      ))}
      
      {/* Water surface texture with boat wake effect */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 overflow-hidden">
        <div 
          className="w-full h-full opacity-15 transition-all duration-200"
          style={{
            background: `
              linear-gradient(
                ${90 + rotation * 0.7}deg, 
                transparent 0%, 
                hsl(var(--ocean-foam) / 0.2) 15%, 
                transparent 30%,
                hsl(var(--ocean-foam) / 0.15) 50%,
                transparent 70%,
                hsl(var(--ocean-foam) / 0.1) 85%,
                transparent 100%
              )
            `,
            transform: `translateX(${position.x * -0.4}px) translateY(${position.y * -0.2 + boatSway * 10}px)`,
          }}
        />
      </div>
      
      {/* Underwater effect when deep */}
      {depthEffect > 0.1 && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 30%,
              hsl(var(--ocean-deep) / ${0.2 + depthEffect * 0.3}) 60%,
              hsl(var(--ocean-deep) / ${0.4 + depthEffect * 0.4}) 100%
            )`,
            opacity: depthEffect * 3,
          }}
        />
      )}
      
      {/* Boat edge (first person view with sway) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-boat-wood/50 to-transparent"
        style={{
          transform: `rotate(${rotation * 0.1 + boatSway * 0.5}deg)`,
        }}
      >
        <div 
          className="absolute bottom-0 left-0 right-0 h-4 bg-boat-wood/70 transition-all duration-200"
          style={{
            transform: `rotate(${rotation * 0.08}deg)`,
          }}
        />
        {/* Boat railing */}
        <div 
          className="absolute bottom-3 left-4 right-4 h-1 bg-boat-wood/80 rounded-full"
          style={{
            transform: `rotate(${rotation * 0.05}deg)`,
          }}
        />
      </div>
    </div>
  );
};
