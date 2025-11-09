
export enum GameState {
  START,
  PLAYING,
  LOADING,
  END,
  ERROR,
}

export type ChoiceType = 'troll' | 'normal' | 'crazy';

export interface Choice {
  text: string;
  type: ChoiceType;
}

export interface Scene {
  sceneText: string;
  choices: Choice[];
}

export interface GameResult {
  title: string;
  summary: string;
}

export interface StoryPayload extends Scene {
    isEndScene: boolean;
    endResult?: GameResult;
}
