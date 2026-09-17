import { DialogueScene } from './DialogueScene';
import { BACKGROUNDS } from '../game/characters';
import type { DialogueLine } from '../game/types';

interface DialogueScreenProps {
  dialogue: DialogueLine[];
  onComplete: () => void;
}

export function DialogueScreen({ dialogue, onComplete }: DialogueScreenProps) {
  return (
    <DialogueScene
      dialogue={dialogue}
      onComplete={onComplete}
      background={BACKGROUNDS.general}
    />
  );
}
