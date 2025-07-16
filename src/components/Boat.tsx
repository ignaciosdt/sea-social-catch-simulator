import { Position } from "./FishingSimulator";

interface BoatProps {
  position: Position;
  isMoving: boolean;
  isFishing: boolean;
}

export const Boat = ({ position, isMoving, isFishing }: BoatProps) => {
  return (
    <div
      className={`absolute transition-all duration-300 ${
        isMoving ? 'animate-boat-bob' : 'animate-boat-bob'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Boat body */}
      <div className="relative">
        {/* Main hull */}
        <div className="w-16 h-8 bg-gradient-boat rounded-full shadow-boat border-2 border-boat-wood/50" />
        
        {/* Mast */}
        <div className="absolute left-1/2 -top-8 w-1 h-8 bg-boat-wood transform -translate-x-1/2" />
        
        {/* Sail */}
        <div className="absolute left-1/2 -top-6 w-6 h-4 bg-boat-sail rounded transform -translate-x-1/2 opacity-90" />
        
        {/* Fishing rod */}
        {isFishing && (
          <div className="absolute right-0 top-0 w-8 h-1 bg-boat-wood transform rotate-45 origin-left">
            <div className="absolute right-0 top-0 w-px h-6 bg-foreground animate-fishing-line" />
          </div>
        )}
        
        {/* Boat wake */}
        {isMoving && (
          <>
            <div className="absolute -left-2 top-1/2 w-4 h-px bg-ocean-foam opacity-60 animate-ripple" />
            <div className="absolute -right-2 top-1/2 w-4 h-px bg-ocean-foam opacity-60 animate-ripple" style={{ animationDelay: '0.1s' }} />
          </>
        )}
      </div>
    </div>
  );
};