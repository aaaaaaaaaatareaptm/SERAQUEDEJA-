import { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { DialogueScreen } from './components/DialogueScreen';
import { FinalScreen } from './components/FinalScreen';
import { HighScoreScreen } from './components/HighScoreScreen';
import { MinigameAnnounce } from './components/MinigameAnnounce';
import { MinigameTutorial } from './components/MinigameTutorial';
import { FoodMatch } from './components/FoodMatch';
import { GuessFood } from './components/GuessFood';
import {
  QUESTIONS,
  INTRO_DIALOGUE,
  HOST_PRESENTATION,
  GENERAL_TUTORIAL,
  QUESTION_TUTORIAL,
  FOODMATCH_TUTORIAL,
  GUESSFOOD_TUTORIAL,
} from './game/questions';
import {
  TOTAL_QUESTIONS_PER_GAME,
  TOTAL_ACTIVITIES,
  QUESTION_POOL_SIZE,
  MAX_QUESTION_POINTS,
  INCORRECT_PENALTY,
  MINIGAME_MAX_POINTS,
  TOTAL_MAX_SCORE,
} from './game/types';
import type { GamePhase, Activity, DialogueLine, HighScore, GameState } from './game/types';
import './App.css';

const HIGH_SCORE_KEY = 'foodQuizShow_highScores';

function loadHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    if (raw) return JSON.parse(raw) as HighScore[];
  } catch { /* ignore */ }
  return [];
}

function saveHighScores(scores: HighScore[]) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
  } catch { /* ignore */ }
}

function generateActivities(): Activity[] {
  const questionPool = [...QUESTIONS].sort(() => Math.random() - 0.5);
  const selectedQuestions = questionPool.slice(0, TOTAL_QUESTIONS_PER_GAME);

  const activities: Activity[] = selectedQuestions.map((q) => ({
    type: 'question' as const,
    question: q,
  }));

  const minigames: Activity[] = [
    { type: 'foodMatch', minigame: 'foodMatch' },
    { type: 'guessFood', minigame: 'guessFood' },
  ];

  const minigamePositions: number[] = [];
  while (minigamePositions.length < 2) {
    const pos = 1 + Math.floor(Math.random() * (TOTAL_ACTIVITIES - 1));
    if (!minigamePositions.includes(pos)) minigamePositions.push(pos);
  }

  const shuffledMinigames = [...minigames].sort(() => Math.random() - 0.5);
  minigamePositions.sort((a, b) => a - b);

  for (let i = 0; i < 2; i++) {
    activities.splice(minigamePositions[i], 0, shuffledMinigames[i]);
  }

  return activities;
}

function createInitialState(highScores: HighScore[]): GameState {
  return {
    score: 0,
    questionPoints: 0,
    minigamePoints: 0,
    activityIndex: 0,
    questionCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    used5050: false,
    usedHostAdvice: false,
    usedHint: false,
    lifelinesUsedThisQuestion: 0,
    selectedAnswer: null,
    gamePhase: 'home',
    eliminatedOptions: [],
    hintVisible: false,
    hostDialogue: [],
    lastAnswerCorrect: false,
    isHostAdvice: false,
    activities: [],
    currentMaxPoints: MAX_QUESTION_POINTS,
    foodMatchPlayed: false,
    guessFoodPlayed: false,
    currentMinigameScore: 0,
    currentMinigameActions: 0,
    highScores,
    playerName: '',
  };
}

function getMaxPointsForLifelines(lifelinesUsed: number): number {
  if (lifelinesUsed === 0) return 100;
  if (lifelinesUsed === 1) return 75;
  if (lifelinesUsed === 2) return 50;
  return 25;
}

function App() {
  const [state, setState] = useState<GameState>(() => createInitialState(loadHighScores()));

  const startGame = useCallback(() => {
    setState((s) => ({
      ...createInitialState(s.highScores),
      activities: generateActivities(),
      gamePhase: 'intro',
    }));
  }, []);

  const handleIntroComplete = useCallback(() => {
    setState((s) => ({ ...s, gamePhase: 'hostPresentation' }));
  }, []);

  const handlePresentationComplete = useCallback(() => {
    setState((s) => ({ ...s, gamePhase: 'generalTutorial' }));
  }, []);

  const handleGeneralTutorialComplete = useCallback(() => {
    setState((s) => ({ ...s, gamePhase: 'questionTutorial' }));
  }, []);

  const handleQuestionTutorialComplete = useCallback(() => {
    setState((s) => ({
      ...s,
      gamePhase: 'activity',
      activityIndex: 0,
      questionCount: 0,
      currentMaxPoints: MAX_QUESTION_POINTS,
    }));
  }, []);

  const startNextActivity = useCallback(() => {
    setState((s) => {
      const nextIndex = s.activityIndex + 1;
      if (nextIndex >= s.activities.length) {
        return { ...s, gamePhase: 'final' };
      }
      const activity = s.activities[nextIndex];
      if (activity.type === 'question') {
        return {
          ...s,
          activityIndex: nextIndex,
          gamePhase: 'activity',
          selectedAnswer: null,
          eliminatedOptions: [],
          hintVisible: false,
          used5050: false,
          usedHostAdvice: false,
          usedHint: false,
          lifelinesUsedThisQuestion: 0,
          currentMaxPoints: MAX_QUESTION_POINTS,
        };
      }
      // Minigame: announce first
      return {
        ...s,
        activityIndex: nextIndex,
        gamePhase: 'minigameAnnounce',
      };
    });
  }, []);

  const handleAnswer = useCallback((index: number) => {
    setState((s) => {
      const activity = s.activities[s.activityIndex];
      if (!activity.question) return s;
      const question = activity.question;
      const isCorrect = index === question.correctAnswer;
      const pointsAwarded = isCorrect ? s.currentMaxPoints : 0;
      const newScore = isCorrect ? s.score + pointsAwarded : Math.max(0, s.score - INCORRECT_PENALTY);
      const newQuestionPoints = isCorrect
        ? s.questionPoints + pointsAwarded
        : Math.max(0, s.questionPoints - INCORRECT_PENALTY);

      return {
        ...s,
        selectedAnswer: index,
        lastAnswerCorrect: isCorrect,
        score: newScore,
        questionPoints: newQuestionPoints,
        correctCount: isCorrect ? s.correctCount + 1 : s.correctCount,
        incorrectCount: !isCorrect ? s.incorrectCount + 1 : s.incorrectCount,
        questionCount: s.questionCount + 1,
        gamePhase: 'feedback',
      };
    });
  }, []);

  const handleFeedbackContinue = useCallback(() => {
    setState((s) => {
      const activity = s.activities[s.activityIndex];
      if (!activity.question) return s;
      const question = activity.question;
      const dialogue = s.lastAnswerCorrect ? question.dialogueCorrect : question.dialogueIncorrect;
      return { ...s, gamePhase: 'dialogue', hostDialogue: dialogue, isHostAdvice: false };
    });
  }, []);

  const handleDialogueContinue = useCallback(() => {
    startNextActivity();
  }, [startNextActivity]);

  const handle5050 = useCallback(() => {
    setState((s) => {
      if (s.used5050) return s;
      const activity = s.activities[s.activityIndex];
      if (!activity.question) return s;
      const question = activity.question;
      const wrongIndices = question.options
        .map((_, i) => i)
        .filter((i) => i !== question.correctAnswer);
      const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
      const toEliminate = shuffled.slice(0, 2);
      const newLifelineCount = s.lifelinesUsedThisQuestion + 1;
      return {
        ...s,
        used5050: true,
        eliminatedOptions: toEliminate,
        lifelinesUsedThisQuestion: newLifelineCount,
        currentMaxPoints: getMaxPointsForLifelines(newLifelineCount),
      };
    });
  }, []);

  const handleAskHosts = useCallback(() => {
    setState((s) => {
      if (s.usedHostAdvice) return s;
      const activity = s.activities[s.activityIndex];
      if (!activity.question) return s;
      const newLifelineCount = s.lifelinesUsedThisQuestion + 1;
      return {
        ...s,
        usedHostAdvice: true,
        hostDialogue: activity.question.hostAdvice,
        gamePhase: 'dialogue',
        isHostAdvice: true,
        lifelinesUsedThisQuestion: newLifelineCount,
        currentMaxPoints: getMaxPointsForLifelines(newLifelineCount),
      };
    });
  }, []);

  const handleHint = useCallback(() => {
    setState((s) => {
      if (s.usedHint) return s;
      const newLifelineCount = s.lifelinesUsedThisQuestion + 1;
      return {
        ...s,
        usedHint: true,
        hintVisible: true,
        lifelinesUsedThisQuestion: newLifelineCount,
        currentMaxPoints: getMaxPointsForLifelines(newLifelineCount),
      };
    });
  }, []);

  const handleHostAdviceReturn = useCallback(() => {
    setState((s) => ({ ...s, gamePhase: 'activity', hostDialogue: [] }));
  }, []);

  const handleMinigameAnnounceComplete = useCallback(() => {
    setState((s) => {
      const activity = s.activities[s.activityIndex];
      if (activity.type === 'foodMatch' && !s.foodMatchPlayed) {
        return { ...s, gamePhase: 'minigameTutorial' };
      }
      if (activity.type === 'guessFood' && !s.guessFoodPlayed) {
        return { ...s, gamePhase: 'minigameTutorial' };
      }
      return { ...s, gamePhase: 'minigame' };
    });
  }, []);

  const handleMinigameTutorialComplete = useCallback(() => {
    setState((s) => {
      const activity = s.activities[s.activityIndex];
      return {
        ...s,
        gamePhase: 'minigame',
        foodMatchPlayed: activity.type === 'foodMatch' ? true : s.foodMatchPlayed,
        guessFoodPlayed: activity.type === 'guessFood' ? true : s.guessFoodPlayed,
      };
    });
  }, []);

  const handleMinigameComplete = useCallback((minigameScore: number) => {
    setState((s) => ({
      ...s,
      minigamePoints: s.minigamePoints + minigameScore,
      score: s.score + minigameScore,
      currentMinigameScore: minigameScore,
      gamePhase: 'minigameResult',
    }));
  }, []);

  const handleMinigameResultContinue = useCallback(() => {
    startNextActivity();
  }, [startNextActivity]);

  const handleFinalContinue = useCallback(() => {
    setState((s) => ({ ...s, gamePhase: 'highScore' }));
  }, []);

  const handleSubmitName = useCallback((name: string) => {
    setState((s) => {
      const newScore: HighScore = {
        name,
        score: s.score,
        date: new Date().toISOString(),
      };
      const updated = [...s.highScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((hs) => ({ ...hs, score: Math.min(hs.score, TOTAL_MAX_SCORE) }));
      saveHighScores(updated);
      return { ...s, highScores: updated, playerName: name };
    });
  }, []);

  const restartGame = useCallback(() => {
    setState((s) => ({
      ...createInitialState(s.highScores),
      activities: generateActivities(),
      gamePhase: 'intro',
    }));
  }, []);

  const currentActivity = state.activities[state.activityIndex];
  const currentQuestion = currentActivity?.question;

  // Determine dialogue/tutorial content
  let tutorialDialogue: DialogueLine[] = [];
  let minigameName = '';
  if (currentActivity?.type === 'foodMatch') {
    tutorialDialogue = FOODMATCH_TUTORIAL;
    minigameName = 'FOODMATCH';
  } else if (currentActivity?.type === 'guessFood') {
    tutorialDialogue = GUESSFOOD_TUTORIAL;
    minigameName = 'ADIVINA LA COMIDA';
  }

  return (
    <div className="app">
      <div className="app-bg" />
      <div className="app-vignette" />

      {state.gamePhase === 'home' && <HomeScreen onStart={startGame} />}

      {state.gamePhase === 'intro' && (
        <IntroScreen dialogue={INTRO_DIALOGUE} onComplete={handleIntroComplete} />
      )}

      {state.gamePhase === 'hostPresentation' && (
        <IntroScreen dialogue={HOST_PRESENTATION} onComplete={handlePresentationComplete} />
      )}

      {state.gamePhase === 'generalTutorial' && (
        <IntroScreen dialogue={GENERAL_TUTORIAL} onComplete={handleGeneralTutorialComplete} />
      )}

      {state.gamePhase === 'questionTutorial' && (
        <IntroScreen dialogue={QUESTION_TUTORIAL} onComplete={handleQuestionTutorialComplete} />
      )}

      {state.gamePhase === 'activity' && currentQuestion && (
        <QuizScreen
          question={currentQuestion}
          questionNumber={state.questionCount + 1}
          totalQuestions={TOTAL_QUESTIONS_PER_GAME}
          score={state.score}
          state={state}
          onAnswer={handleAnswer}
          on5050={handle5050}
          onAskHosts={handleAskHosts}
          onHint={handleHint}
        />
      )}

      {state.gamePhase === 'feedback' && state.selectedAnswer !== null && currentQuestion && (
        <FeedbackScreen
          question={currentQuestion}
          isCorrect={state.lastAnswerCorrect}
          pointsAwarded={state.lastAnswerCorrect ? state.currentMaxPoints : 0}
          onContinue={handleFeedbackContinue}
        />
      )}

      {state.gamePhase === 'dialogue' && state.hostDialogue.length > 0 && (
        <DialogueScreen
          dialogue={state.hostDialogue}
          onComplete={state.isHostAdvice ? handleHostAdviceReturn : handleDialogueContinue}
        />
      )}

      {state.gamePhase === 'minigameAnnounce' && (
        <MinigameAnnounce
          minigameName={minigameName}
          onComplete={handleMinigameAnnounceComplete}
        />
      )}

      {state.gamePhase === 'minigameTutorial' && (
        <MinigameTutorial
          dialogue={tutorialDialogue}
          minigameName={minigameName}
          onStart={handleMinigameTutorialComplete}
        />
      )}

      {state.gamePhase === 'minigame' && currentActivity?.type === 'foodMatch' && (
        <FoodMatch onComplete={handleMinigameComplete} />
      )}

      {state.gamePhase === 'minigame' && currentActivity?.type === 'guessFood' && (
        <GuessFood onComplete={handleMinigameComplete} />
      )}

      {state.gamePhase === 'minigameResult' && (
        <div className="screen minigame-result-screen">
          <div className="quiz-overlay" />
          <div className="minigame-result-content">
            <div className="minigame-result-badge">{minigameName || 'MINIJUEGO'}</div>
            <h2 className="minigame-result-title">¡MINIJUEGO COMPLETADO!</h2>
            <div className="minigame-result-score">
              <span className="minigame-result-number">{state.currentMinigameScore}</span>
              <span className="minigame-result-max">/ {MINIGAME_MAX_POINTS}</span>
            </div>
            <button className="btn-continue" onClick={handleMinigameResultContinue}>
              CONTINUAR ▸
            </button>
          </div>
        </div>
      )}

      {state.gamePhase === 'final' && (
        <FinalScreen
          score={state.score}
          questionPoints={state.questionPoints}
          minigamePoints={state.minigamePoints}
          correctCount={state.correctCount}
          incorrectCount={state.incorrectCount}
          onContinue={handleFinalContinue}
        />
      )}

      {state.gamePhase === 'highScore' && (
        <HighScoreScreen
          highScores={state.highScores}
          currentScore={state.score}
          onSubmitName={handleSubmitName}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

export default App;
