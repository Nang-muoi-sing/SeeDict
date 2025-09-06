export const replaceChineseQuotes = (text: string): string => {
  return text
    .replace(/“/g, '「') // 左引号“ → 「
    .replace(/”/g, '」'); // 右引号” → 」
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

export const circleExplanations = (expls: string[]): string => {
  return expls.map((item) => `◯${item}`).join('');
};

export const clipLength = (text: string, length: number): string => {
  const chars = [...text];
  return chars.length <= length
    ? text
    : chars.slice(0, length - 2).join("") + '……';
};
