import fuzhouMap from '../data/relationship-fuzhou.json';
import { mandarinMap } from '../data/relationship-mandarin';
// ref: https://github.com/mumuy/relationship/blob/master/src/module/data/main.js

export type FuzhouTerm = {
  name: string;
  reading: string;
  type: 'formal' | 'back' | 'child';
  region?: string;
  isOutdated?: boolean;
  wordId?: string;
};

const fuzhouRelativesMap = fuzhouMap as Record<string, FuzhouTerm[]>;
const mandarinRelativesMap = mandarinMap as Record<string, string[]>;

export const getFuzhouTerms = (mandarin: string): FuzhouTerm[] => {
  if (mandarin in fuzhouRelativesMap) {
    return fuzhouRelativesMap[mandarin];
  }

  const aliases = mandarinRelativesMap[mandarin] || [];
  const termMap = aliases.reduce((acc, key) => {
    if (key && fuzhouRelativesMap[key]) {
      fuzhouRelativesMap[key].forEach((term) => {
        const uniqueKey = `${term.name}|${term.reading}|${term.type}`;
        if (!acc.has(uniqueKey)) {
          acc.set(uniqueKey, term);
        }
      });
    }
    return acc;
  }, new Map<string, FuzhouTerm>());

  return Array.from(termMap.values());
};
