import type { CharacterId, SpriteState } from '../game/types';
import { getSpritePath } from '../game/characters';

interface CharacterPortraitProps {
  character: CharacterId;
  spriteState?: SpriteState;
  expression?: string;
  size?: number;
}

export function CharacterPortrait({ character, spriteState = 'neutral', size = 260 }: CharacterPortraitProps) {
  return (
    <div className="character-portrait" style={{ width: size, height: size }}>
      <img
        src={getSpritePath(character, spriteState)}
        alt={character}
        className="character-sprite"
        draggable={false}
      />
    </div>
  );
}
