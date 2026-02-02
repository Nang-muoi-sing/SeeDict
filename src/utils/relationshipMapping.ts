import fuzhouMap from '../data/relationship-fuzhou.json';

export type FuzhouTerm = {
  name: string;
  reading: string;
  type: 'formal' | 'back' | 'rare';
};

const typedMap = fuzhouMap as Record<string, FuzhouTerm[]>;

export const getFuzhouTerms = (mandarin: string): FuzhouTerm[] => {
  if (typedMap[mandarin]) {
    return typedMap[mandarin];
  }
  return [];
};
