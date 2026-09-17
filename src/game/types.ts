export type GamePhase =
  | 'home'
  | 'logo'
  | 'intro'
  | 'hostPresentation'
  | 'generalTutorial'
  | 'questionTutorial'
  | 'activity'
  | 'minigameAnnounce'
  | 'minigameTutorial'
  | 'minigame'
  | 'minigameResult'
  | 'feedback'
  | 'dialogue'
  | 'final'
  | 'highScore';

export type CharacterId = 'heart' | 'brain' | 'stomach';

export type SpriteState = 'neutral' | 'talk' | 'acierto' | 'fallo';

export type Expression = 'neutral' | 'happy' | 'thinking' | 'surprised' | 'smug' | 'sad' | 'hungry';

export interface DialogueLine {
  character: CharacterId;
  expression: Expression;
  text: string;
}

export type ActivityType = 'question' | 'foodMatch' | 'guessFood';

export interface Question {
  id: number;
  category: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
  dialogueCorrect: DialogueLine[];
  dialogueIncorrect: DialogueLine[];
  hostAdvice: DialogueLine[];
}

export interface Character {
  id: CharacterId;
  name: string;
  emoji: string;
  color: string;
  accent: string;
  description: string;
}

export interface Activity {
  type: ActivityType;
  question?: Question;
  minigame?: 'foodMatch' | 'guessFood';
}

export interface GameState {
  score: number;
  questionPoints: number;
  minigamePoints: number;
  activityIndex: number;
  questionCount: number;
  correctCount: number;
  incorrectCount: number;
  used5050: boolean;
  usedHostAdvice: boolean;
  usedHint: boolean;
  lifelinesUsedThisQuestion: number;
  selectedAnswer: number | null;
  gamePhase: GamePhase;
  eliminatedOptions: number[];
  hintVisible: boolean;
  hostDialogue: DialogueLine[];
  lastAnswerCorrect: boolean;
  isHostAdvice: boolean;
  activities: Activity[];
  currentMaxPoints: number;
  foodMatchPlayed: boolean;
  guessFoodPlayed: boolean;
  currentMinigameScore: number;
  currentMinigameActions: number;
  highScores: HighScore[];
  playerName: string;
}

export interface HighScore {
  name: string;
  score: number;
  date: string;
}

export const MAX_QUESTION_POINTS = 100;
export const MINIGAME_ACTION_POINTS = 50;
export const MINIGAME_MAX_ACTIONS = 8;
export const MINIGAME_MAX_POINTS = 400;
export const TOTAL_MAX_SCORE = 1800;
export const TOTAL_QUESTIONS_PER_GAME = 10;
export const TOTAL_ACTIVITIES = 12;
export const QUESTION_POOL_SIZE = 15;
export const INCORRECT_PENALTY = 50;
