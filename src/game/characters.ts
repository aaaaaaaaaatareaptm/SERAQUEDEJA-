import type { Character, CharacterId, SpriteState } from './types';

export const CHARACTERS: Record<CharacterId, Character> = {
  heart: {
    id: 'heart',
    name: 'CORAZÓN',
    emoji: '❤️',
    color: '#e63946',
    accent: '#ff6b7a',
    description: 'El presentador principal',
  },
  brain: {
    id: 'brain',
    name: 'CEREBRO',
    emoji: '🧠',
    color: '#4cc9f0',
    accent: '#7de0ff',
    description: 'El copresentador analítico',
  },
  stomach: {
    id: 'stomach',
    name: 'ESTÓMAGO',
    emoji: '🫃',
    color: '#f4a261',
    accent: '#ffbe7d',
    description: 'El personaje cómico',
  },
};

const SPRITE_PREFIX: Record<CharacterId, string> = {
  brain: 'cer',
  heart: 'cor',
  stomach: 'es',
};

export function getSpritePath(character: CharacterId, state: SpriteState): string {
  return `/images/${SPRITE_PREFIX[character]}.${state}.png`;
}

export const BACKGROUNDS = {
  general: '/images/FONDOGENERAL.jpg',
  zoom: '/images/ZOOM.jpg',
  foodMatch: '/images/FOODMATCH_FONDO.jpg',
  guessFood: '/images/ZOOM.jpg',
};
