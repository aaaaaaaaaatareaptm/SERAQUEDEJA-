import { useState } from 'react';
import type { HighScore } from '../game/types';
import { TOTAL_MAX_SCORE } from '../game/types';

interface HighScoreScreenProps {
  highScores: HighScore[];
  currentScore: number;
  onSubmitName: (name: string) => void;
  onRestart: () => void;
}

export function HighScoreScreen({ highScores, currentScore, onSubmitName, onRestart }: HighScoreScreenProps) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const qualifies = currentScore > 0 && highScores.length < 10 || highScores.some((hs) => currentScore > hs.score);

  const handleSubmit = () => {
    const finalName = name.trim() || 'JUGADOR';
    onSubmitName(finalName);
    setSubmitted(true);
  };

  return (
    <div className="screen highscore-screen">
      <div className="highscore-content">
        <h1 className="highscore-title">RANKING</h1>

        {!submitted && qualifies && (
          <div className="highscore-input-area">
            <p className="highscore-input-label">¡Has entrado en el ranking! Escribe tu nombre:</p>
            <div className="highscore-input-row">
              <input
                className="highscore-input"
                type="text"
                maxLength={12}
                value={name}
                placeholder="TU NOMBRE"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className="highscore-submit-btn" onClick={handleSubmit}>
                GUARDAR
              </button>
            </div>
          </div>
        )}

        <div className="highscore-table">
          {highScores.length === 0 && !qualifies && (
            <p className="highscore-empty">Aún no hay puntuaciones. ¡Sé el primero!</p>
          )}
          {highScores.map((hs, i) => (
            <div
              key={i}
              className={`highscore-row ${hs.score === currentScore && submitted ? 'highscore-row--current' : ''}`}
            >
              <span className="highscore-rank">{i + 1}.</span>
              <span className="highscore-name">{hs.name}</span>
              <span className="highscore-score">{hs.score}</span>
            </div>
          ))}
        </div>

        <p className="highscore-max-info">Puntuación máxima posible: {TOTAL_MAX_SCORE} puntos</p>

        <button className="btn-restart" onClick={onRestart}>
          JUGAR DE NUEVO
        </button>
      </div>
    </div>
  );
}
