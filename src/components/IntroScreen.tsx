import { DialogueScene } from './DialogueScene';
import { BACKGROUNDS } from '../game/characters';
import type { DialogueLine } from '../game/types';

interface IntroScreenProps {
  dialogue: DialogueLine[];
  onComplete: () => void;
}

export function IntroScreen({ dialogue, onComplete }: IntroScreenProps) {
  return (
    <DialogueScene
      dialogue={dialogue}
      onComplete={onComplete}
      background={BACKGROUNDS.general}
    />
  );
}
