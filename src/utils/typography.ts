export const replaceChineseQuotes = (text: string): string => {
  return text
    .replace(/‘/g, '『') //左单引号 ‘ → 『
    .replace(/’/g, '』') //右单引号 ’ → 』
    .replace(/“/g, '「') // 左双引号 “ → 「
    .replace(/”/g, '」'); // 右双引号 ” → 」
};

export const correctStops = (text: string): string => {
  if (!text.trim()) return text;
  const endsWithValidStop = /([。？！」』]|。）|？）|！）)$/.test(text);
  return endsWithValidStop ? text : text + '。';
};

export const replaceChinesePunctuation = (text: string): string => {
  const punctuationMap: Record<string, string> = {
    '‘': '『',
    '’': '』',
    '“': '「',
    '”': '」',
    '(': '（',
    ')': '）',
    '~': '～',
    '?': '？',
    '!': '！',
    ',': '，',
    '.': '。',
    '<書>': '〈書〉',
  };

  const regex = /‘|’|“|”|\(|\)|~|\?|!|,|(?<!\d)\.|<書>/g;
  return text.replace(regex, (match) => punctuationMap[match]);
};

// 替换文本中的 {A,B} 格式
export const toggleGlyph = (
  text: string,
  mode: 'first' | 'second' = 'second'
): string => {
  const regex = /\{([^,]+),([^}]+)\}/g;
  return text.replace(regex, (_, first, second) => {
    return mode === 'first' ? first : second;
  });
};

export const parseText = (
  text: string,
  mode: 'first' | 'second' = 'second'
): string => {
  return replaceChinesePunctuation(toggleGlyph(text, mode));
};

export const circleExplanations = (expls: string[]): string => {
  return expls.map((item) => `◯${item}`).join('');
};

export const clipLength = (text: string, length: number): string => {
  const chars = [...text];
  return chars.length <= length
    ? text
    : chars.slice(0, length - 2).join('') + '……';
};
