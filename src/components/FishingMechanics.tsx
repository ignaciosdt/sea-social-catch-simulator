import { Position } from "./FishingSimulator";

interface FishingMechanicsProps {
  isFishing: boolean;
  position: Position;
}

export const FishingMechanics = ({ isFishing, position }: FishingMechanicsProps) => {

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