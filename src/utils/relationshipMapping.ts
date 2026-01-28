export const fuzhouNameMap: Record<string, string[]> = {
  爸爸: ['爸爸'],
  妈妈: ['妈妈'],
  父亲: ['父亲'],
  母亲: ['母亲'],
  爷爷: ['爷爷'],
  奶奶: ['奶奶'],
  外公: ['外公'],
  外婆: ['外婆'],
  丈夫: ['丈夫'],
  妻子: ['妻子'],
  哥哥: ['哥哥'],
  弟弟: ['弟弟'],
  姐姐: ['姐姐'],
  妹妹: ['妹妹'],
  儿子: ['儿子'],
  女儿: ['女儿'],
};

export const mapFuzhouNames = (mandarin: string): string[] => {
  const mapped = fuzhouNameMap[mandarin];
  if (mapped && mapped.length) {
    return mapped;
  }
  return [mandarin];
};
