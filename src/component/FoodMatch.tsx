import { useState, useEffect, useCallback } from 'react';
import { BACKGROUNDS } from '../game/characters';
import { MINIGAME_MAX_ACTIONS, MINIGAME_ACTION_POINTS } from '../game/types';

interface FoodMatchProps {
  onComplete: (score: number) => void;
}

interface MatchItem {
  food: string;
  emoji: string;
  category: string;
}

const FOOD_ITEMS: MatchItem[] = [
  { food: 'Manzana', emoji: '🍎', category: 'Fruta' },
  { food: 'Pollo', emoji: '🍗', category: 'Proteína' },
  { food: 'Pan integral', emoji: '🍞', category: 'Cereal' },
  { food: 'Brócoli', emoji: '🥦', category: 'Verdura' },
  { food: 'Salmón', emoji: '🐟', category: 'Proteína' },
  { food: 'Plátano', emoji: '🍌', category: 'Fruta' },
  { food: 'Arroz', emoji: '🍚', category: 'Cereal' },
  { food: 'Zanahoria', emoji: '🥕', category: 'Verdura' },
  { food: 'Huevo', emoji: '🥚', category: 'Proteína' },
  { food: 'Naranja', emoji: '🍊', category: 'Fruta' },
  { food: 'Lechuga', emoji: '🥬', category: 'Verdura' },
  { food: 'Avena', emoji: '🥣', category: 'Cereal' },
];

const CATEGORIES = ['Fruta', 'Verdura', 'Proteína', 'Cereal'];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function FoodMatch({ onComplete }: FoodMatchProps) {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [actions, setActions] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setItems(shuffleArray(FOOD_ITEMS).slice(0, MINIGAME_MAX_ACTIONS));
  }, []);

  const currentItem = items[currentIndex];

  const handleSelect = useCallback((category: string) => {
    if (feedback !== null || !currentItem) return;
    setSelectedCategory(category);
    const isCorrect = category === currentItem.category;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    const newActions = actions + 1;
    const newScore = isCorrect ? score + MINIGAME_ACTION_POINTS : score;

    setTimeout(() => {
      setFeedback(null);
      setSelectedCategory(null);
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
      <div className="screen minigame-result-screen" style={{ backgroundImage: `url(${BACKGROUNDS.foodMatch})` }}>
        <div className="quiz-overlay" />
        <div className="minigame-result-content">
          <div className="minigame-result-badge">FOODMATCH</div>
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
    <div className="screen minigame-screen foodmatch-screen" style={{ backgroundImage: `url(${BACKGROUNDS.foodMatch})` }}>
      <div className="quiz-overlay" />
      <div className="minigame-content">
        <div className="minigame-header">
          <div className="minigame-score-badge">
            <span className="minigame-score-label">PUNTOS</span>
            <span className="minigame-score-value" key={score}>{score}</span>
          </div>
          <div className="minigame-progress">
            <span className="minigame-progress-label">ACIERTOS</span>
            <span className="minigame-progress-value">{actions} / {MINIGAME_MAX_ACTIONS}</span>
          </div>
        </div>

        <div className="foodmatch-game">
          <div className="foodmatch-prompt">¿A qué categoría pertenece?</div>
          <div className={`foodmatch-item ${feedback ? `foodmatch-item--${feedback}` : ''}`}>
            <span className="foodmatch-emoji">{currentItem.emoji}</span>
            <span className="foodmatch-name">{currentItem.food}</span>
          </div>

          <div className="foodmatch-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`foodmatch-cat-btn ${selectedCategory === cat ? `foodmatch-cat-btn--${feedback}` : ''}`}
                onClick={() => handleSelect(cat)}
                disabled={feedback !== null}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
