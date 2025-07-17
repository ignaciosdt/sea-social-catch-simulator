
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GameState } from "./FishingSimulator";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Anchor, Trophy, Package, Fuel, Waves } from "lucide-react";

interface GameUIProps {
  gameState: GameState;
  onMove: (direction: 'up' | 'down' | 'left' | 'right' | 'dive' | 'surface') => void;
  onFish: () => void;
}

export const GameUI = ({ gameState, onMove, onFish }: GameUIProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-secondary';
      case 'rare': return 'bg-primary';
      case 'epic': return 'bg-accent';
      case 'legendary': return 'bg-fish-gold';
      default: return 'bg-secondary';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-secondary-foreground';
      case 'rare': return 'text-primary-foreground';
      case 'epic': return 'text-accent-foreground';
      case 'legendary': return 'text-foreground';
      default: return 'text-secondary-foreground';
    }
  };

  const getDepthColor = () => {
    if (gameState.depth < 25) return 'text-primary';
    if (gameState.depth < 50) return 'text-accent';
    if (gameState.depth < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Panel */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-start gap-4">
          {/* Score and Stats */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-ui">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-fish-gold" />
                Puntuación: {gameState.score}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-primary" />
                <span className="text-sm">Combustible:</span>
                <Progress value={gameState.fuel} className="w-20" />
                <span className="text-sm">{Math.round(gameState.fuel)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-ocean-surface" />
                <span className="text-sm">Profundidad:</span>
                <span className={`text-sm font-medium ${getDepthColor()}`}>
                  {Math.round(gameState.depth)}m
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-accent" />
                <span className="text-sm">Peces: {gameState.inventory.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-ui max-w-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gameState.inventory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No has pescado nada aún</p>
                ) : (
                  gameState.inventory.map((fish, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fish.icon}</span>
                        <span className="text-sm">{fish.name}</span>
                      </div>
                      <Badge className={`${getRarityColor(fish.rarity)} ${getRarityTextColor(fish.rarity)}`}>
                        {fish.points}pts
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-end">
          {/* Movement Controls */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-ui">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Controles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-1 max-w-32">
                <div />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('up')}
                  disabled={gameState.isFishing || gameState.fuel <= 0}
                  className="p-2"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('left')}
                  disabled={gameState.isFishing || gameState.fuel <= 0}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('down')}
                  disabled={gameState.isFishing || gameState.fuel <= 0}
                  className="p-2"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('right')}
                  disabled={gameState.isFishing || gameState.fuel <= 0}
                  className="p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('surface')}
                  disabled={gameState.isFishing || gameState.fuel <= 0 || gameState.depth <= 0}
                  className="p-2 text-xs"
                >
                  ↑ Subir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove('dive')}
                  disabled={gameState.isFishing || gameState.fuel <= 0}
                  className="p-2 text-xs"
                >
                  ↓ Bucear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fishing Button */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-ui">
            <CardContent className="pt-6">
              <Button
                variant="default"
                size="lg"
                onClick={onFish}
                disabled={gameState.isFishing}
                className="bg-primary hover:bg-primary/90 shadow-glow"
              >
                <Anchor className="w-5 h-5 mr-2" />
                {gameState.isFishing ? 'Pescando...' : 'Pescar'}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-card/90 backdrop-blur-sm shadow-ui">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>WASD o flechas: Mover</p>
                <p>Q: Bucear más profundo</p>
                <p>E: Subir a superficie</p>
                <p>Espacio: Pescar</p>
                <p>Mayor profundidad = mejores peces</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
