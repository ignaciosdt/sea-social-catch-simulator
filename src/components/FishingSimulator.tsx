import { useState, useEffect, useCallback } from "react";
import { Ocean } from "./Ocean";
import { Boat } from "./Boat";
import { GameUI } from "./GameUI";
import { FishingMechanics } from "./FishingMechanics";

export interface Position {
  x: number;
  y: number;
}

export interface Fish {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  icon: string;
}

export interface GameState {
  position: Position;
  inventory: Fish[];
  score: number;
  isFishing: boolean;
  fuel: number;
  isMoving: boolean;
}

export const FishingSimulator = () => {
  const [gameState, setGameState] = useState<GameState>({
    position: { x: 400, y: 300 },
    inventory: [],
    score: 0,
    isFishing: false,
    fuel: 100,
    isMoving: false
  });

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.isFishing || gameState.fuel <= 0) return;

    setGameState(prev => {
      const newPosition = { ...prev.position };
      const moveDistance = 20;
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(50, newPosition.y - moveDistance);
          break;
        case 'down':
          newPosition.y = Math.min(550, newPosition.y + moveDistance);
          break;
        case 'left':
          newPosition.x = Math.max(50, newPosition.x - moveDistance);
          break;
        case 'right':
          newPosition.x = Math.min(750, newPosition.x + moveDistance);
          break;
      }

      return {
        ...prev,
        position: newPosition,
        fuel: Math.max(0, prev.fuel - 1),
        isMoving: true
      };
    });

    // Reset moving state after animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isMoving: false }));
    }, 300);
  }, [gameState.isFishing, gameState.fuel]);

  const handleFish = useCallback(() => {
    if (gameState.isFishing) return;

    setGameState(prev => ({ ...prev, isFishing: true }));

    // Simulate fishing time
    setTimeout(() => {
      const fishTypes: Fish[] = [
        { id: '1', name: 'Sardina', rarity: 'common', points: 10, icon: '🐟' },
        { id: '2', name: 'Atún', rarity: 'rare', points: 25, icon: '🐠' },
        { id: '3', name: 'Pez Espada', rarity: 'epic', points: 50, icon: '🗡️' },
        { id: '4', name: 'Tiburón Dorado', rarity: 'legendary', points: 100, icon: '🦈' }
      ];

      // Random chance to catch fish
      const catchChance = Math.random();
      if (catchChance > 0.3) {
        const rarityRoll = Math.random();
        let caughtFish: Fish;
        
        if (rarityRoll < 0.5) {
          caughtFish = fishTypes[0]; // Common
        } else if (rarityRoll < 0.8) {
          caughtFish = fishTypes[1]; // Rare
        } else if (rarityRoll < 0.95) {
          caughtFish = fishTypes[2]; // Epic
        } else {
          caughtFish = fishTypes[3]; // Legendary
        }

        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, { ...caughtFish, id: Date.now().toString() }],
          score: prev.score + caughtFish.points,
          isFishing: false
        }));
      } else {
        setGameState(prev => ({ ...prev, isFishing: false }));
      }
    }, 2000);
  }, [gameState.isFishing]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          handleMove('up');
          break;
        case 's':
        case 'arrowdown':
          handleMove('down');
          break;
        case 'a':
        case 'arrowleft':
          handleMove('left');
          break;
        case 'd':
        case 'arrowright':
          handleMove('right');
          break;
        case ' ':
          e.preventDefault();
          handleFish();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove, handleFish]);

  // Refuel over time
  useEffect(() => {
    const fuelInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        fuel: Math.min(100, prev.fuel + 0.5)
      }));
    }, 1000);

    return () => clearInterval(fuelInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-ocean">
      <Ocean />
      <Boat 
        position={gameState.position} 
        isMoving={gameState.isMoving}
        isFishing={gameState.isFishing}
      />
      <FishingMechanics 
        isFishing={gameState.isFishing}
        position={gameState.position}
      />
      <GameUI
        gameState={gameState}
        onMove={handleMove}
        onFish={handleFish}
      />
    </div>
  );
};