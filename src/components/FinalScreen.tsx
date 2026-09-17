import { CharacterPortrait } from './CharacterPortrait';
import { TOTAL_MAX_SCORE } from '../game/types';

interface FinalScreenProps {
  score: number;
  questionPoints: number;
  minigamePoints: number;
  correctCount: number;
  incorrectCount: number;
  onContinue: () => void;
}

export function FinalScreen({
  score,
  questionPoints,
  minigamePoints,
  correctCount,
  incorrectCount,
  onContinue,
}: FinalScreenProps) {
  const percentage = Math.round((score / TOTAL_MAX_SCORE) * 100);

  let rank: string;
  let rankCharacter: 'heart' | 'brain' | 'stomach';
  let rankSprite: 'acierto' | 'fallo' | 'neutral';

  if (percentage >= 85) {
    rank = 'CAMPEÓN NUTRICIONAL';
    rankCharacter = 'heart';
    rankSprite = 'acierto';
  } else if (percentage >= 65) {
    rank = 'EXPERTO EN COMIDA';
    rankCharacter = 'brain';
    rankSprite = 'acierto';
  } else if (percentage >= 40) {
    rank = 'COMEDOR CURIOSO';
    rankCharacter = 'stomach';
    rankSprite = 'neutral';
  } else if (percentage >= 20) {
    rank = 'APRENDIENDO LO BÁSICO';
    rankCharacter = 'heart';
    rankSprite = 'neutral';
  } else {
    rank = 'PRINCIPIANTE HAMBRIENTO';
    rankCharacter = 'stomach';
    rankSprite = 'fallo';
  }

  return (
    <div className="screen final-screen">
      <div className="final-spotlight" />
      <div className="final-content">
        <div className="final-character-wrapper">
          <CharacterPortrait character={rankCharacter} spriteState={rankSprite} size={200} />
        </div>

        <div className="final-badge">FIN DEL PROGRAMA</div>
        <h1 className="final-title">PUNTUACIÓN FINAL</h1>

        <div className="final-score-display">
          <span className="final-score-number" key={score}>{score}</span>
          <span className="final-score-max">/ {TOTAL_MAX_SCORE}</span>
        </div>

        <div className="final-rank">
          <span className="final-rank-label">RANGO</span>
          <span className="final-rank-name">{rank}</span>
        </div>

        <div className="final-stats">
          <div className="final-stat">
            <span className="final-stat-value">{questionPoints}</span>
            <span className="final-stat-label">Preguntas</span>
          </div>
          <div className="final-stat">
            <span className="final-stat-value">{minigamePoints}</span>
            <span className="final-stat-label">Minijuegos</span>
          </div>
          <div className="final-stat">
            <span className="final-stat-value">{correctCount}</span>
            <span className="final-stat-label">Aciertos</span>
          </div>
          <div className="final-stat">
            <span className="final-stat-value">{incorrectCount}</span>
            <span className="final-stat-label">Fallos</span>
          </div>
        </div>

        <button className="btn-continue" onClick={onContinue}>
          VER RANKING ▸
        </button>
      </div>
    </div>
  );
}
