export interface JokeSettings {
  topic: string;
  tone: string;
  jokeType: string;
  temperature: number;
}

export const defaultSettings: JokeSettings = {
  topic: 'anything',
  tone: 'funny',
  jokeType: 'any',
  temperature: 0.7,
};

export const jokeTopics = [
  'anything',
  'animals',
  'food',
  'work',
  'technology',
  'sports',
  'movies',
  'music',
  'science',
  'history',
];

export const jokeTones = [
  'funny',
  'silly',
  'witty',
  'sarcastic',
  'clever',
  'goofy',
  'punny',
];

export const jokeTypes = [
  'any',
  'one-liner',
  'knock-knock',
  'wordplay',
  'story',
  'pun',
  'riddle',
]; 