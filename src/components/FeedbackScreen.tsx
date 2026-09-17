import type { Question } from '../game/types';

interface FeedbackScreenProps {
  question: Question;
  isCorrect: boolean;
  pointsAwarded: number;
  onContinue: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function FeedbackScreen({ question, isCorrect, pointsAwarded, onContinue }: FeedbackScreenProps) {
  return (
    <div className="screen feedback-screen">
      <div className={`feedback-banner ${isCorrect ? 'feedback-banner--correct' : 'feedback-banner--wrong'}`}>
        <span className="feedback-banner-text">{isCorrect ? '¡CORRECTO!' : 'INCORRECTO'}</span>
        <span className="feedback-banner-score">
          {isCorrect ? `+${pointsAwarded}` : '-50'}
        </span>
      </div>

      <div className="feedback-panel">
        {!isCorrect && (
          <div className="feedback-correct-answer">
            <span className="feedback-correct-label">La respuesta correcta era:</span>
            <div className="feedback-correct-option">
              <span className="answer-letter answer-letter--correct">{LETTERS[question.correctAnswer]}</span>
              <span className="answer-text">{question.options[question.correctAnswer]}</span>
            </div>
          </div>
        )}

        <div className="feedback-explanation">
          <span className="feedback-explanation-label">EXPLICACIÓN</span>
          <p className="feedback-explanation-text">{question.explanation}</p>
        </div>

        <button className="btn-continue" onClick={onContinue}>
          CONTINUAR ▸
        </button>
      </div>
    </div>
  );
}
