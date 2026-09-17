import { useState, useEffect } from 'react';
import { CharacterPortrait } from './CharacterPortrait';
import { CHARACTERS } from '../game/characters';
import type { DialogueLine, CharacterId, SpriteState } from '../game/types';

interface DialogueSceneProps {
  dialogue: DialogueLine[];
  onComplete: () => void;
  background?: string;
}

const ALL_CHARACTERS: CharacterId[] = ['heart', 'brain', 'stomach'];

export function DialogueScene({ dialogue, onComplete, background }: DialogueSceneProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentLine = dialogue[lineIndex];

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const text = currentLine.text;
    const timer = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [lineIndex, currentLine.text]);

  const handleContinue = () => {
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }
    if (lineIndex < dialogue.length - 1) {
      setLineIndex(lineIndex + 1);
    } else {
      onComplete();
    }
  };

  const speakingCharacter = currentLine.character;
  const character = CHARACTERS[speakingCharacter];

  const getSpriteState = (charId: CharacterId): SpriteState => {
    if (charId !== speakingCharacter) return 'neutral';
    if (currentLine.expression === 'happy' || currentLine.expression === 'smug') return 'acierto';
    if (currentLine.expression === 'sad' || currentLine.expression === 'surprised') return 'fallo';
    return 'talk';
  };

  return (
    <div className="screen dialogue-screen" style={background ? { backgroundImage: `url(${background})` } : undefined}>
      <div className="vn-stage vn-stage--multi">
        <div className="vn-characters-row">
          {ALL_CHARACTERS.map((charId) => (
            <div
              key={charId}
              className={`vn-character-slot ${charId === speakingCharacter ? 'vn-character-slot--active' : ''}`}
            >
              <CharacterPortrait
                character={charId}
                spriteState={getSpriteState(charId)}
                size={charId === speakingCharacter ? 220 : 170}
              />
            </div>
          ))}
        </div>
        <div className="vn-nameplate" style={{ borderColor: character.color, color: character.color }}>
          {character.emoji} {character.name}
        </div>
        <div className="vn-dialogue-box" onClick={handleContinue}>
          <p className="vn-dialogue-text">
            {displayedText}
            {isTyping && <span className="vn-cursor">▌</span>}
          </p>
          <button className="vn-continue-btn">
            {lineIndex < dialogue.length - 1 ? 'SIGUIENTE ▸' : 'CONTINUAR ▸'}
          </button>
        </div>
      </div>
    </div>
  );
}
