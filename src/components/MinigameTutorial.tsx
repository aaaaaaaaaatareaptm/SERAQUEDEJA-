import { DialogueScene } from './DialogueScene';
import { BACKGROUNDS } from '../game/characters';
import type { DialogueLine } from '../game/types';

interface MinigameTutorialProps {
  dialogue: DialogueLine[];
  minigameName: string;
  onStart: () => void;
}

export function MinigameTutorial({ dialogue, minigameName, onStart }: MinigameTutorialProps) {
  return (
    <div className="minigame-tutorial-wrapper">
      <DialogueScene
        dialogue={dialogue}
        onComplete={onStart}
        background={BACKGROUNDS.general}
      />
      <div className="minigame-tutorial-title">{minigameName}</div>
    </div>
  );
}
