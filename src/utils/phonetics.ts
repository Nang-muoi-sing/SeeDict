import {
  phonologyBanguaceFinalToneMap,
  phonologyBanguaceInitialMap,
  yngpingFengIPAEndToneMap,
  yngpingFengIPAFinalMap,
  yngpingFengIPAInitialMap,
  yngpingFengIPAToneMap,
  yngpingIPAFinalMap,
  yngpingIPAInitialMap,
  yngpingIPAToneMap,
  yngpingTypingCursiveFinalToneMap,
} from './mapping';

export const yngpingInitialPattern = /^(b|p|m|d|t|l|s|z|c|g|k|h|w|j|ng|nj|n)/;

const endWithLowercase = (str: string): boolean => {
  if (!str) return false;
  const code = str.charCodeAt(str.length - 1);
  return code >= 97 && code <= 122;
};

const parseBrace = (syllable: string): [string, boolean] => {
  if (!syllable.startsWith('{') || !syllable.endsWith('}')) {
    return [syllable, false];
  }

  syllable = syllable.replace('{', '');
  syllable = syllable.replace('}', '');
  return [syllable, true];
};

export const yngpingToIPA = (
  yngping: string,
  feng_style: boolean = false
): string => {
  const rawYngping = yngping.trim();
  if (rawYngping.length === 0) {
    return '';
  }

  let initialMap, finalMap, toneMap, endToneMap;
  if (feng_style) {
    initialMap = yngpingFengIPAInitialMap;
    finalMap = yngpingFengIPAFinalMap;
    toneMap = yngpingFengIPAToneMap;
  } else {
    initialMap = yngpingIPAInitialMap;
    finalMap = yngpingIPAFinalMap;
    toneMap = yngpingIPAToneMap;
  }
  endToneMap = yngpingFengIPAEndToneMap;

  const syllables = rawYngping.split(' ');
  const tonePattern = /\d+$/;
  const results = [];

  for (let i = 0; i < syllables.length; i++) {
    let [syllable, _] = parseBrace(syllables[i]);
    // 无声调，在 IPA 里视作 0
    if (endWithLowercase(syllable)) {
      syllable += '0';
    }

    const initialMatch = syllable.match(yngpingInitialPattern);
    let initial = initialMatch ? initialMatch[0] : '';
    const toneMatch = syllable.match(tonePattern);
    let tone: string | null = toneMatch ? toneMatch[0] : null;

    let remaining = initial ? syllable.slice(initial.length) : syllable;
    remaining = tone ? remaining.slice(0, -tone.length) : remaining;
    let final = remaining || '';

    if (tone === null) {
      console.error(`音节 "${syllable}" 的声调信息不完整`);
      return '';
    }

    // ng 既作声母也作韵母，当没有其他韵母时就是韵母
    if (initial === 'ng' && final === '') {
      initial = '';
      final = 'ng';
    }

    tone =
      !feng_style || syllables.length === 1 || i !== syllables.length - 1
        ? toneMap[tone]
        : endToneMap[tone];

    results.push(`${initialMap[initial]}${finalMap[final]}${tone}`);
  }
  return results.join(' ');
};

export const yngpingToCursive = (yngping: string): string => {
  const rawYngping = yngping.trim();
  if (rawYngping.length === 0) {
    return '';
  }

  return rawYngping
    .split(' ')
    .map((syllable) => makeYngpingCursive(syllable))
    .join(' ');
};

export const phonologyToBanguace = (
  phobologyInitial: string,
  phonologyFinal: string,
  phonologyTone: string
) => {
  const initial = phonologyBanguaceInitialMap[phobologyInitial] ?? '';
  const final =
    phonologyBanguaceFinalToneMap[`${phonologyFinal}${phonologyTone}`] ?? '';
  return `${initial}${final}`;
};

export const makeYngpingRubyInner = (
  text: string,
  yngping: string,
  rubyClass: string = '',
  syllableConvertor: CallableFunction = makeYngpingCursive,
  syllablesConvertor: CallableFunction = makeYngpingsCursive
): string => {
  if (!text || !yngping) {
    return `<span class="rb">${text}</span><rp>(</rp><rt class="${rubyClass}">${text}</rt><rp>)</rp>`;
  }

  const chars = text.trim().split('');
  const charProns = yngping.trim().split(' ');

  if (charProns.length !== chars.length) {
    return `<span class="rb">${text}</span><rp>(</rp><rt class="${rubyClass}">${syllablesConvertor(yngping)}</rt><rp>)</rp>`;
  } else {
    let rubyString = '';
    for (let i = 0; i < chars.length; i++) {
      rubyString += `<span class="rb">${chars[i]}</span><rp>(</rp><rt class="${rubyClass}">${syllableConvertor(charProns[i])}</rt><rp>)</rp>`;
    }
    return rubyString;
  }
};

export const makeYngpingSup = (yngping: string): string => {
  const [parsedYngping, shouldAddBrace] = parseBrace(yngping);
  const tone = parsedYngping.match(/\d+$/);
  const yngpingLetter = parsedYngping.replace(/\d+$/, '');

  if (shouldAddBrace) {
    return tone ? `{${yngpingLetter}<sup>${tone}</sup>}` : `{${parsedYngping}}`;
  }

  return tone ? `${yngpingLetter}<sup>${tone}</sup>` : parsedYngping;
};

export const makeYngpingsSup = (yngping: string): string => {
  const yngpings = yngping.trim().split(' ');
  return yngpings.map(makeYngpingSup).join('');
};

export const makeYngpingCursive = (yngping: string): string => {
  let [parsedYngping, shouldAddBrace] = parseBrace(yngping);
  // 有花括号且无声调，在手写里视作 55
  if (shouldAddBrace && endWithLowercase(parsedYngping)) {
    parsedYngping += '55';
  }

  const initialMatch = parsedYngping.match(yngpingInitialPattern);
  const initial = initialMatch ? initialMatch[0] : '';
  const finalAndTone =
    yngpingTypingCursiveFinalToneMap[parsedYngping.slice(initial.length)];

  return `${initial}${finalAndTone}` == ''
    ? ''
    : shouldAddBrace
      ? `{${initial}${finalAndTone}}`
      : `${initial}${finalAndTone}`;
};

export const makeYngpingsCursive = yngpingToCursive;
