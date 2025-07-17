
import { useState, useEffect, useCallback } from "react";
import { FirstPersonOcean } from "./FirstPersonOcean";
import { FirstPersonFishing } from "./FirstPersonFishing";
import { GameUI } from "./GameUI";

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Fish {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  icon: string;
}

export interface GameState {
  rotation: number;
  position: Position;
  inventory: Fish[];
  score: number;
  isFishing: boolean;
  fuel: number;
  isMoving: boolean;
  depth: number;
}

export const FishingSimulator = () => {
  const [gameState, setGameState] = useState<GameState>({
    rotation: 0,
    position: { x: 0, y: 0, z: 0 },
    inventory: [],
    score: 0,
    isFishing: false,
    fuel: 100,
    isMoving: false,
    depth: 0
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const handleMove = useCallback((direction: 'forward' | 'backward' | 'left' | 'right' | 'dive' | 'surface') => {
    if (gameState.isFishing || gameState.fuel <= 0) return;

    setGameState(prev => {
      let newRotation = prev.rotation;
      let newPosition = { ...prev.position };
      let newDepth = prev.depth;
      const moveSpeed = 3;
      const rotationSpeed = 2;
      
      switch (direction) {
        case 'left':
          // Strafe left relative to current rotation
          const strafeLeftX = Math.cos(newRotation * Math.PI / 180) * moveSpeed;
          const strafeLeftY = Math.sin(newRotation * Math.PI / 180) * moveSpeed;
          newPosition.x -= strafeLeftX;
          newPosition.y -= strafeLeftY;
          break;
        case 'right':
          // Strafe right relative to current rotation
          const strafeRightX = Math.cos(newRotation * Math.PI / 180) * moveSpeed;
          const strafeRightY = Math.sin(newRotation * Math.PI / 180) * moveSpeed;
          newPosition.x += strafeRightX;
          newPosition.y += strafeRightY;
          break;
        case 'forward':
          // Move forward based on current rotation
          const forwardX = Math.sin(newRotation * Math.PI / 180) * moveSpeed;
          const forwardY = Math.cos(newRotation * Math.PI / 180) * moveSpeed;
          newPosition.x += forwardX;
          newPosition.y -= forwardY;
          break;
        case 'backward':
          // Move backward
          const backwardX = Math.sin(newRotation * Math.PI / 180) * moveSpeed;
          const backwardY = Math.cos(newRotation * Math.PI / 180) * moveSpeed;
          newPosition.x -= backwardX;
          newPosition.y += backwardY;
          break;
        case 'dive':
          newDepth = Math.min(100, newDepth + moveSpeed);
          newPosition.z = newDepth;
          break;
        case 'surface':
          newDepth = Math.max(0, newDepth - moveSpeed);
          newPosition.z = newDepth;
          break;
      }

      return {
        ...prev,
        rotation: newRotation,
        position: newPosition,
        depth: newDepth,
        fuel: Math.max(0, prev.fuel - 0.2),
        isMoving: true
      };
    });

    // Reset moving state after animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isMoving: false }));
    }, 100);
  }, [gameState.isFishing, gameState.fuel]);

  const handleRotate = useCallback((direction: 'left' | 'right') => {
    if (gameState.isFishing) return;

    setGameState(prev => {
      const rotationSpeed = 3;
      let newRotation = prev.rotation;
      
      switch (direction) {
        case 'left':
          newRotation = prev.rotation - rotationSpeed;
          break;
        case 'right':
          newRotation = prev.rotation + rotationSpeed;
          break;
      }

      return {
        ...prev,
        rotation: newRotation,
        isMoving: true
      };
    });

    // Reset moving state after animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isMoving: false }));
    }, 100);
  }, [gameState.isFishing]);

  const handleFish = useCallback(() => {
    if (gameState.isFishing) return;

    setGameState(prev => ({ ...prev, isFishing: true }));

    // Simulate fishing time based on depth
    const fishingTime = 1500 + gameState.depth * 10;
    
    setTimeout(() => {
      const fishTypes: Fish[] = [
        { id: '1', name: 'Sardina', rarity: 'common', points: 10, icon: '🐟' },
        { id: '2', name: 'Atún', rarity: 'rare', points: 25, icon: '🐠' },
        { id: '3', name: 'Pez Espada', rarity: 'epic', points: 50, icon: '🗡️' },
        { id: '4', name: 'Tiburón Dorado', rarity: 'legendary', points: 100, icon: '🦈' },
        { id: '5', name: 'Pez Abisal', rarity: 'legendary', points: 150, icon: '🐙' }
      ];

      // Better catch chances at different depths
      const depthBonus = gameState.depth * 0.01;
      const catchChance = 0.4 + depthBonus;
      
      if (Math.random() < catchChance) {
        const rarityRoll = Math.random() + depthBonus;
        let caughtFish: Fish;
        
        if (gameState.depth > 50 && rarityRoll > 0.9) {
          caughtFish = fishTypes[4]; // Deep sea fish
        } else if (rarityRoll < 0.4) {
          caughtFish = fishTypes[0]; // Common
        } else if (rarityRoll < 0.7) {
          caughtFish = fishTypes[1]; // Rare
        } else if (rarityRoll < 0.9) {
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
    }, fishingTime);
  }, [gameState.isFishing, gameState.depth]);

  // Handle continuous movement with WASD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
      
      // Handle fishing on space release
      if (e.key === ' ') {
        e.preventDefault();
        handleFish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleFish]);

  // Continuous movement based on held keys
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (keys['w'] || keys['arrowup']) handleMove('forward');
      if (keys['s'] || keys['arrowdown']) handleMove('backward');
      if (keys['a'] || keys['arrowleft']) handleMove('left');
      if (keys['d'] || keys['arrowright']) handleMove('right');
      if (keys['q']) handleMove('dive');
      if (keys['e']) handleMove('surface');
    }, 50);

    return () => clearInterval(moveInterval);
  }, [keys, handleMove]);

  // Mouse rotation (like Minecraft)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        const sensitivity = 0.3;
        const deltaX = e.movementX * sensitivity;
        
        setGameState(prev => ({
          ...prev,
          rotation: prev.rotation + deltaX
        }));
      }
    };

    const handleClick = () => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      } else {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Refuel over time
  useEffect(() => {
    const fuelInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        fuel: Math.min(100, prev.fuel + 0.3)
      }));
    }, 1000);

    return () => clearInterval(fuelInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-ocean">
      <FirstPersonOcean 
        rotation={gameState.rotation}
        position={gameState.position}
        isMoving={gameState.isMoving}
      />
      <FirstPersonFishing 
        isFishing={gameState.isFishing}
        rotation={gameState.rotation}
      />
      <GameUI
        gameState={gameState}
        onMove={handleMove}
        onFish={handleFish}
      />
    </div>
  );
};
