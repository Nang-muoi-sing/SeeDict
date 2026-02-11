import fuzhouMap from '../data/relationship-fuzhou.json';

// ref: https://github.com/mumuy/relationship/blob/master/src/module/data/main.js

export type FuzhouTerm = {
  name: string;
  reading: string;
  type: 'formal' | 'back' | 'child';
  region?: string;
  isOutdated?: boolean;
  wordId?: string;
};

const typedMap = fuzhouMap as Record<string, FuzhouTerm[]>;

export const relationAliasGroupedByTarget: Record<string, string[]> = {
  表伯父: ['舅表伯父', '姨伯父',],
  表伯母: ['舅表伯母'],
  表姐: ['舅表姐', '姨姐'],
  表姐夫: ['舅表姐夫', '姨姐夫'],
  表舅父: ['姨舅父', '舅表舅父'],
  表舅母: ['姨舅岳母', '舅表舅母', '姨舅母'],
  表嫂: ['姨嫂'],
  表兄: ['舅表哥', '姨哥'],
  表兄嫂: ['舅表嫂'],
  表姨父: ['姨姨父', '姨姨岳父'],
  表姨母: ['姨姨母', '姨姨岳母'],
  曾孙媳: ['曾孙妇'],
  弟媳: ['弟妹'],
  儿媳: ['儿媳妇'],
  父亲: ['爸爸'],
  舅父: ['大舅', '小舅'],
  舅公: ['舅外公', '舅爷爷'],
  舅母: ['大舅妈', '小舅妈'],
  舅婆: ['舅外婆', '舅奶奶'],
  母亲: ['妈妈'],
  奶奶: ['祖母'],
  妻子: ['老婆'],
  孙媳: ['孙媳妇'],
  外曾祖父: ['曾外祖父'],
  外曾祖母: ['曾外祖母'],
  外甥女婿: ['甥女婿'],
  外甥媳: ['外甥媳妇', '甥媳妇'],
  外孙媳: ['外孙媳妇'],
  外祖父: ['外公'],
  外祖母: ['外婆'],
  兄嫂: ['嫂子'],
  爷爷: ['祖父'],
  姨公: ['姨外公', '姨爷爷'],
  姨母: ['大姨', '小姨'],
  姨婆: ['姨外婆', '姨奶奶'],
  姨丈: ['小姨丈', '大姨丈'],
  丈夫: ['老公'],
  侄媳: ['侄媳妇'],
  表姑: ['舅表姑母', '姨姑母'],
  表姑丈: ['舅表姑父'],
  姑妈: ['大姑'],
  姑姑: ['小姑'],
  叔父: ['叔叔'],
  叔母: ['婶婶'],
  堂兄: ['堂哥'],
  堂兄嫂: ['堂嫂'],
};

const relationAliasMap = Object.entries(relationAliasGroupedByTarget).reduce<
  Record<string, string>
>((acc, [targetKey, aliasKeys]) => {
  for (const aliasKey of aliasKeys) {
    acc[aliasKey] = targetKey;
  }
  return acc;
}, {});

export const getFuzhouTerms = (mandarin: string): FuzhouTerm[] => {
  if (typedMap[mandarin]) {
    return typedMap[mandarin];
  }

  const alias = relationAliasMap[mandarin];
  if (alias && typedMap[alias]) {
    return typedMap[alias];
  }

  return [];
};
