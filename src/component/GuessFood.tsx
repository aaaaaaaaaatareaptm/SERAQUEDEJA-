import { useState, useEffect, useCallback } from 'react';
import { BACKGROUNDS } from '../game/characters';
import { MINIGAME_MAX_ACTIONS, MINIGAME_ACTION_POINTS } from '../game/types';

interface GuessFoodProps {
  onComplete: (score: number) => void;
}

interface GuessItem {
  answer: string;
  emoji: string;
  options: string[];
}

const GUESS_ITEMS: GuessItem[] = [
  { answer: 'Pizza', emoji: '🍕', options: ['Pizza', 'Sopa', 'Ensalada', 'Pasta'] },
  { answer: 'Hamburguesa', emoji: '🍔', options: ['Sándwich', 'Hamburguesa', 'Taco', 'Croqueta'] },
  { answer: 'Sushi', emoji: '🍣', options: ['Ramen', 'Sushi', 'Dumpling', 'Fideos'] },
  { answer: 'Donut', emoji: '🍩', options: ['Bagel', 'Donut', 'Croissant', 'Galleta'] },
  { answer: 'Taco', emoji: '🌮', options: ['Burrito', 'Taco', 'Quesadilla', 'Fajita'] },
  { answer: 'Helado', emoji: '🍦', options: ['Yogur', 'Helado', 'Pastel', 'Pudding'] },
  { answer: 'Sandwich', emoji: '🥪', options: ['Sandwich', 'Panini', 'Wrap', 'Tostada'] },
  { answer: 'Fideos', emoji: '🍜', options: ['Arroz', 'Fideos', 'Sopa', 'Couscous'] },
  { answer: 'Café', emoji: '☕', options: ['Té', 'Café', 'Cacao', 'Cola'] },
  { answer: 'Galleta', emoji: '🍪', options: ['Galleta', 'Pastel', 'Donut', 'Bizcocho'] },
];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function GuessFood({ onComplete }: GuessFoodProps) {
  const [items, setItems] = useState<GuessItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [actions, setActions] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setItems(shuffleArray(GUESS_ITEMS).slice(0, MINIGAME_MAX_ACTIONS));
  }, []);

  const currentItem = items[currentIndex];

  const handleSelect = useCallback((option: string) => {
    if (feedback !== null || !currentItem) return;
    setSelectedOption(option);
    const isCorrect = option === currentItem.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    const newActions = actions + 1;
    const newScore = isCorrect ? score + MINIGAME_ACTION_POINTS : score;

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setActions(newActions);
      setScore(newScore);

      if (newActions >= MINIGAME_MAX_ACTIONS) {
        setGameOver(true);
      } else {
        setCurrentIndex(newActions);
      }
    }, 900);
  }, [feedback, currentItem, actions, score]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => onComplete(score), 1500);
      return () => clearTimeout(timer);
    }
  }, [gameOver, score, onComplete]);

  if (gameOver) {
    return (
      <div className="screen minigame-result-screen" style={{ backgroundImage: `url(${BACKGROUNDS.guessFood})` }}>
        <div className="quiz-overlay" />
        <div className="minigame-result-content">
          <div className="minigame-result-badge">ADIVINA LA COMIDA</div>
          <h2 className="minigame-result-title">¡MINIJUEGO COMPLETADO!</h2>
          <div className="minigame-result-score">
            <span className="minigame-result-number">{score}</span>
            <span className="minigame-result-max">/ 400</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="screen minigame-screen guessfood-screen" style={{ backgroundImage: `url(${BACKGROUNDS.guessFood})` }}>
      <div className="quiz-overlay" />
      <div className="minigame-content">
        <div className="minigame-header">
          <div className="minigame-score-badge">
            <span className="minigame-score-label">PUNTOS</span>
            <span className="minigame-score-value" key={score}>{score}</span>
          </div>
          <div className="minigame-progress">
            <span className="minigame-progress-label">RONDAS</span>
            <span className="minigame-progress-value">{actions} / {MINIGAME_MAX_ACTIONS}</span>
          </div>
        </div>

        <div className="guessfood-game">
          <div className="guessfood-prompt">¿Qué alimento es?</div>
          <div className={`guessfood-pixel ${feedback ? `guessfood-pixel--${feedback}` : ''}`}>
            <span className="guessfood-emoji">{currentItem.emoji}</span>
          </div>

          <div className="guessfood-options">
            {currentItem.options.map((opt) => (
              <button
                key={opt}
                className={`guessfood-option ${selectedOption === opt ? `guessfood-option--${feedback}` : ''}`}
                onClick={() => handleSelect(opt)}
                disabled={feedback !== null}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
