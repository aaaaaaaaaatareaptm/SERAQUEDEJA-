import type { Question, GameState } from '../game/types';
import { MAX_QUESTION_POINTS } from '../game/types';

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  state: GameState;
  onAnswer: (index: number) => void;
  on5050: () => void;
  onAskHosts: () => void;
  onHint: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  score,
  state,
  onAnswer,
  on5050,
  onAskHosts,
  onHint,
}: QuizScreenProps) {
  const isAnswering = state.selectedAnswer !== null;
  const hintVisible = state.hintVisible;
  const maxPoints = state.currentMaxPoints;

  return (
    <div className="screen quiz-screen" style={{ backgroundImage: 'url(/images/ZOOM.jpg)' }}>
      <div className="quiz-overlay" />
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-score-badge">
            <span className="quiz-score-label">PUNTOS</span>
            <span className="quiz-score-value" key={score}>{score}</span>
          </div>
          <div className="quiz-progress">
            <span className="quiz-progress-label">PREGUNTA</span>
            <span className="quiz-progress-value">{questionNumber} / {totalQuestions}</span>
          </div>
          <div className="quiz-max-badge">
            <span className="quiz-max-label">MÁX</span>
            <span className="quiz-max-value">{maxPoints}</span>
          </div>
          <div className="quiz-category-badge">{question.category}</div>
        </div>

        <div className="quiz-panel">
          <div className="quiz-panel-deco quiz-panel-deco--left" />
          <div className="quiz-panel-deco quiz-panel-deco--right" />
          <div className="quiz-question-number">PREGUNTA {questionNumber}</div>
          <h2 className="quiz-question-text">{question.question}</h2>

          <div className="quiz-answers quiz-answers--grid">
            {question.options.map((option, i) => {
              const isEliminated = state.eliminatedOptions.includes(i);
              const isSelected = state.selectedAnswer === i;
              const isCorrect = i === question.correctAnswer;
              const showCorrect = isAnswering && isCorrect;
              const showWrong = isAnswering && isSelected && !isCorrect;

              let className = 'answer-btn';
              if (isEliminated) className += ' answer-btn--eliminated';
              if (showCorrect) className += ' answer-btn--correct';
              if (showWrong) className += ' answer-btn--wrong';

              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => !isAnswering && !isEliminated && onAnswer(i)}
                  disabled={isAnswering || isEliminated}
                >
                  <span className="answer-letter">{LETTERS[i]}</span>
                  <span className="answer-text">{option}</span>
                  {showCorrect && <span className="answer-icon answer-icon--correct">✓</span>}
                  {showWrong && <span className="answer-icon answer-icon--wrong">✕</span>}
                </button>
              );
            })}
          </div>

          {hintVisible && (
            <div className="quiz-hint-box">
              <span className="quiz-hint-label">PISTA</span>
              <p className="quiz-hint-text">{question.hint}</p>
            </div>
          )}

          <div className="lifelines">
            <button
              className={`lifeline-btn ${state.used5050 ? 'lifeline-btn--used' : ''}`}
              onClick={on5050}
              disabled={state.used5050 || isAnswering}
            >
              <span className="lifeline-icon">50/50</span>
              <span className="lifeline-label">Eliminar 2</span>
            </button>
            <button
              className={`lifeline-btn ${state.usedHostAdvice ? 'lifeline-btn--used' : ''}`}
              onClick={onAskHosts}
              disabled={state.usedHostAdvice || isAnswering}
            >
              <span className="lifeline-icon">💬</span>
              <span className="lifeline-label">Hablar con Hosts</span>
            </button>
            <button
              className={`lifeline-btn ${state.usedHint ? 'lifeline-btn--used' : ''}`}
              onClick={onHint}
              disabled={state.usedHint || isAnswering}
            >
              <span className="lifeline-icon">💡</span>
              <span className="lifeline-label">Pista</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
