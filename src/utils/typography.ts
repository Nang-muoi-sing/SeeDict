const CHINESE_RANGE = [
  '\u4E00-\u9FA5', // 基本区
  '\u3400-\u4DBF', // 扩展A
  '\u{20000}-\u{2A6DF}', // 扩展B
  '\u{2A700}-\u{2B73F}', // 扩展C
  '\u{2B740}-\u{2B81F}', // 扩展D
  '\u{2B820}-\u{2CEAF}', // 扩展E
  '\u{2CEB0}-\u{2EBEF}', // 扩展F
  '\u{30000}-\u{3134F}', // 扩展G
  '\u{31350}-\u{323AF}', // 扩展H
  '\uF900-\uFAFF', // 兼容区
  '\uFE30-\uFE4F', // 中日韩兼容形式补充
].join('');

export const correctChineseQuotes = (text: string): string => {
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

export const correctChinesePunctuation = (text: string): string => {
  const punctuationMap: Record<string, string> = {
    '‘': '『',
    '’': '』',
    '“': '「',
    '”': '」',
    '(': '（',
    ')': '）',
    '~': '～',
    ':': '：',
    '?': '？',
    '!': '！',
    ',': '，',
    '<書>': '〈書〉',
  };

  return (
    text
      .replace(/(‘|’|“|”|~|\?|!|<書>)/g, (match) => punctuationMap[match])
      .replace(/,([^ ])/g, (_, after) => `，${after}`)
      .replace(/:([^ ])/g, (_, after) => `：${after}`)
      // 处理左右括号（前后不是数字 | 空格 | 字母）
      .replace(
        /([^\d\\sA-Za-z]|^)\(([^\d\sA-Za-z])/g,
        (_, prev, next) => `${prev}${punctuationMap['(']}${next}`
      )
      .replace(
        /([^\d\\sA-Za-z]|^)\)([^\d\sA-Za-z])/g,
        (_, prev, next) => `${prev}${punctuationMap[')']}${next}`
      )
  );
};

export const correctChineseSpace = (text: string): string => {
  return text
    .replace(new RegExp(`([${CHINESE_RANGE}])([a-zA-Z0-9])`, 'gu'), '$1 $2')
    .replace(new RegExp(`([a-zA-Z0-9])([${CHINESE_RANGE}])`, 'gu'), '$1 $2');
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

export const correctText = (text: string): string => {
  return correctChineseSpace(correctChinesePunctuation(text));
};

export const parseText = (
  text: string,
  mode: 'first' | 'second' = 'second'
): string => {
  return correctText(toggleGlyph(text, mode));
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
