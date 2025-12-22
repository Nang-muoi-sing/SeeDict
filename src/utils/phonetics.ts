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

  syllable = syllable.replace(/\{/g, '');
  syllable = syllable.replace(/\}/g, '');
  return [syllable, true];
};

export const parseYngping = (
  yngping: string
): [string | null, string | null, string | null] => {
  yngping = yngping.trim();
  if (yngping.length === 0) {
    return [null, null, null];
  }

  const tonePattern = /\d+$/;

  const initialMatch = yngping.match(yngpingInitialPattern);
  let initial: string | null = initialMatch ? initialMatch[0] : '';
  const toneMatch = yngping.match(tonePattern);
  let tone: string | null = toneMatch ? toneMatch[0] : null;

  const remaining = initial ? yngping.slice(initial.length) : yngping;
  let final: string | null = (() => {
    if (!tone) return remaining;
    if (tone.length < remaining.length) return remaining.slice(0, -tone.length);
    return '';
  })();

  // ng 既作声母也作韵母，当没有其他韵母时就是韵母
  if (initial === 'ng' && (final === '' || final === null)) {
    initial = '';
    final = 'ng';
  }

  // 声调 5 兼容 55
  tone = tone === '5' ? '55' : tone;

  initial = initial in yngpingIPAInitialMap ? initial : null;
  final = final in yngpingIPAFinalMap ? final : null;
  tone = tone && tone in yngpingIPAToneMap ? tone : null;

  return [initial, final, tone];
};

export const yngpingToIPA = (
  yngping: string,
  feng_style: boolean = false
): string => {
  const rawYngping = yngping.trim();
  if (rawYngping.length === 0) {
    return '';
  }

  let initialMap, finalMap, toneMap;
  if (feng_style) {
    initialMap = yngpingFengIPAInitialMap;
    finalMap = yngpingFengIPAFinalMap;
    toneMap = yngpingFengIPAToneMap;
  } else {
    initialMap = yngpingIPAInitialMap;
    finalMap = yngpingIPAFinalMap;
    toneMap = yngpingIPAToneMap;
  }
  const endToneMap = yngpingFengIPAEndToneMap;

  const syllables = rawYngping.split(' ');
  const results = [];

  for (let i = 0; i < syllables.length; i++) {
    let [syllable] = parseBrace(syllables[i]);
    // 无声调，在 IPA 里视作 0
    if (endWithLowercase(syllable)) {
      syllable += '0';
    }

    const [initial, final, tone] = parseYngping(syllable);

    if (initial === null || final === null || tone === null) {
      console.error(`音节 "${syllable}" 无效`);
      return '';
    }

    const ipaTone =
      !feng_style || syllables.length === 1 || i !== syllables.length - 1
        ? toneMap[tone]
        : endToneMap[tone];

    results.push(`${initialMap[initial]}${finalMap[final]}${ipaTone}`);
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
  return yngpings.map(makeYngpingSup).join(' ');
};

export const makeYngpingCursive = (yngping: string): string => {
  const [_parsedYngping, shouldAddBrace] = parseBrace(yngping);
  let parsedYngping = _parsedYngping;
  // 有花括号且无声调，在手写里视作 55
  if (shouldAddBrace && endWithLowercase(parsedYngping)) {
    parsedYngping += '55';
  }

  const [initial, final, tone] = parseYngping(parsedYngping);

  if (initial === null || final === null || tone === null) {
    console.error(`音节 "${yngping}" 无效`);
    return '';
  }
  const finalAndTone = [final, tone].join('');
  if (!(finalAndTone in yngpingTypingCursiveFinalToneMap)) {
    console.error(`音节 "${yngping}" 无效`);
    return '';
  }

  return `${initial}${yngpingTypingCursiveFinalToneMap[finalAndTone]}`;
};

export const makeYngpingsCursive = yngpingToCursive;
