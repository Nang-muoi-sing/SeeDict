<template>
  <PageContent :show-search-bar="false">
    <div class="flex flex-col gap-6 lg:flex-row">
      <section class="flex-1 space-y-6">
        <header class="space-y-2">
          <p class="text-wheat-500 text-xs tracking-[0.3em]">gëüng guói</p>
          <h1 class="text-rosybrown-800 text-3xl font-bold">
            工具
          </h1>
          <p class="text-wheat-600 text-sm leading-6">
            在榕拼键入、榕拼手写与国际音标之间实时转换，逐个音节校验并提示错误，帮助你快速完成不同注音方案之间的互换。
          </p>
        </header>

        <div
          class="rounded-2xl bg-white p-8 md:p-10 shadow-sm ring-1 ring-wheat-200 space-y-10"
        >
          <div class="grid gap-8 lg:grid-cols-2">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <p class="text-rosybrown-700 text-sm font-semibold">
                  输入方案
                </p>
                <select
                  v-model="sourceScheme"
                  class="rounded-lg border border-wheat-200 px-3 py-2 text-sm text-rosybrown-700 outline-none ring-wheat-200 transition focus:border-wheat-400 focus:ring-2"
                >
                  <option
                    v-for="option in schemeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <textarea
                v-model="inputText"
                class="min-h-[20rem] w-full rounded-2xl border border-wheat-200 bg-wheat-50/60 p-6 text-base leading-relaxed text-rosybrown-900 outline-none transition focus:border-wheat-400 focus:bg-white focus:ring-2 focus:ring-wheat-200"
                :placeholder="placeholders[sourceScheme]"
              ></textarea>
              <p class="text-wheat-500 text-xs">
                输入多个音节时用空格分隔，可直接粘贴整句。
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <p class="text-rosybrown-700 text-sm font-semibold">
                  输出方案
                </p>
                <select
                  v-model="targetScheme"
                  class="rounded-lg border border-wheat-200 px-3 py-2 text-sm text-rosybrown-700 outline-none ring-wheat-200 transition focus:border-wheat-400 focus:ring-2"
                >
                  <option
                    v-for="option in schemeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div
                class="min-h-[20rem] w-full rounded-2xl border border-wheat-200 bg-wheat-50/40 p-6 text-base leading-relaxed text-rosybrown-900"
              >
                <template v-if="hasResultContent">
                  <span
                    v-for="(token, index) in resultTokens"
                    :key="index"
                    :class="[
                      'inline text-rosybrown-900',
                      token.type === 'error' &&
                        'rounded-md bg-rose-50 px-1 text-rose-700 ring-1 ring-rose-100',
                      token.type === 'whitespace' && 'whitespace-pre',
                    ]"
                  >
                    {{ token.text }}
                  </span>
                </template>
                <p v-else class="text-wheat-500 text-sm">
                  输入左侧内容后将在此处显示转换结果
                </p>
              </div>
              <p
                v-if="errorMessages.length"
                class="rounded-xl bg-rose-50/80 px-3 py-2 text-sm text-rose-600"
              >
                检测到 {{ errorMessages.length }} 个音节未能转换：
                <span class="font-semibold">{{ errorMessages.join('、') }}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageContent from '../components/PageContent.vue';
import {
  makeYngpingCursive,
  yngpingInitialPattern,
  yngpingToIPA,
} from '../utils/phonetics';
import {
  yngpingIPAInitialMap,
  yngpingIPAFinalMap,
  yngpingIPAToneMap,
  yngpingTypingCursiveFinalToneMap,
} from '../utils/mapping';

type Scheme = 'typing' | 'cursive' | 'ipa';
type TokenType = 'normal' | 'error' | 'whitespace';

interface DisplayToken {
  text: string;
  raw: string;
  type: TokenType;
  message?: string;
}

interface ConversionResult {
  tokens: DisplayToken[];
}

const schemeOptions = [
  { label: '榕拼键入', value: 'typing' },
  { label: '榕拼手写', value: 'cursive' },
  { label: '国际音标', value: 'ipa' },
] as const;

const placeholders: Record<Scheme, string> = {
  typing: '例如：uoh213 fe24 ny55',
  cursive: '例如：uóh fé ńg',
  ipa: '例如：uoʔ˨˦ fei˧˥ ŋ̍˥˥',
};

const tonePattern = /\d+$/;
const inputText = ref('');
const sourceScheme = ref<Scheme>('typing');
const targetScheme = ref<Scheme>('cursive');

const cursiveToTypingMap = Object.entries(
  yngpingTypingCursiveFinalToneMap
).reduce<Record<string, string>>((acc, [typingKey, cursiveValue]) => {
  if (!acc[cursiveValue]) {
    acc[cursiveValue] = typingKey;
  }
  return acc;
}, {});

const ipaInitialEntries = Object.entries(yngpingIPAInitialMap)
  .map(([typing, ipa]) => ({ typing, ipa }))
  .sort((a, b) => b.ipa.length - a.ipa.length);

const ipaFinalMap: Record<string, string> = {};
Object.entries(yngpingIPAFinalMap).forEach(([typing, ipa]) => {
  if (!ipaFinalMap[ipa]) {
    ipaFinalMap[ipa] = typing;
  }
});

const ipaToneEntries = Object.entries(yngpingIPAToneMap)
  .map(([tone, ipa]) => ({ tone, ipa }))
  .sort((a, b) => b.ipa.length - a.ipa.length);

const tokenize = (text: string): string[] =>
  text.match(/\s+|\S+/g) ?? [];

const conversionResult = computed<ConversionResult>(() => {
  if (!inputText.value) {
    return { tokens: [] };
  }

  const fragments = tokenize(inputText.value);
  const tokens: DisplayToken[] = fragments.map((fragment) => {
    if (/^\s+$/.test(fragment)) {
      return {
        text: fragment,
        raw: fragment,
        type: 'whitespace',
      };
    }
    return convertFragment(fragment, sourceScheme.value, targetScheme.value);
  });

  return { tokens };
});

const resultTokens = computed(() => conversionResult.value.tokens);
const hasResultContent = computed(() =>
  resultTokens.value.some((token) => token.type !== 'whitespace')
);
const errorMessages = computed(() =>
  resultTokens.value
    .filter((token) => token.type === 'error' && token.message)
    .map((token) => `${token.raw}（${token.message}）`)
);

function convertFragment(
  fragment: string,
  source: Scheme,
  target: Scheme
): DisplayToken {
  const trimmed = fragment.trim();
  if (!trimmed) {
    return { text: fragment, raw: fragment, type: 'whitespace' };
  }

  const typingResult = convertToTyping(trimmed, source);
  if (!typingResult.success) {
    return {
      text: fragment,
      raw: fragment,
      type: 'error',
      message: typingResult.message,
    };
  }

  const converted = convertFromTyping(typingResult.value, target);
  return {
    text: converted,
    raw: fragment,
    type: 'normal',
  };
}

function convertFromTyping(syllable: string, target: Scheme): string {
  if (target === 'typing') {
    return syllable;
  }
  if (target === 'cursive') {
    return makeYngpingCursive(syllable);
  }
  return yngpingToIPA(syllable);
}

type ConvertResult =
  | { success: true; value: string }
  | { success: false; message: string };

function convertToTyping(syllable: string, source: Scheme): ConvertResult {
  if (source === 'typing') {
    return validateTypingSyllable(syllable);
  }
  if (source === 'cursive') {
    return convertCursiveToTyping(syllable);
  }
  return convertIPAToTyping(syllable);
}

function validateTypingSyllable(syllable: string): ConvertResult {
  const lower = syllable.toLowerCase();
  const toneMatch = lower.match(tonePattern);
  if (!toneMatch) {
    return { success: false, message: '缺少声调数字' };
  }

  const tone = toneMatch[0];
  const letterPart = lower.slice(0, lower.length - tone.length);
  if (!letterPart) {
    return { success: false, message: '缺少韵母部分' };
  }

  const initialMatch = letterPart.match(yngpingInitialPattern);
  let initial = initialMatch ? initialMatch[0] : '';
  let rest = letterPart.slice(initial.length);

  if (initial === 'ng' && !rest) {
    initial = '';
    rest = 'ng';
  }

  if (!(initial in yngpingIPAInitialMap)) {
    return { success: false, message: '声母不合法' };
  }

  if (!rest || !(rest in yngpingIPAFinalMap)) {
    return { success: false, message: '韵母不合法' };
  }

  if (!(tone in yngpingIPAToneMap)) {
    return { success: false, message: '声调不合法' };
  }

  return { success: true, value: `${initial}${rest}${tone}` };
}

function convertCursiveToTyping(syllable: string): ConvertResult {
  const lower = syllable.toLowerCase();
  const initialMatch = lower.match(yngpingInitialPattern);
  let initial = initialMatch ? initialMatch[0] : '';
  let finalPart = lower.slice(initial.length);

  if (initial === 'ng' && !finalPart) {
    initial = '';
    finalPart = 'ng';
  }

  if (!finalPart) {
    return { success: false, message: '缺少韵母部分' };
  }

  const typingFinalTone = cursiveToTypingMap[finalPart];
  if (!typingFinalTone) {
    return { success: false, message: '未识别的手写韵母' };
  }

  const toneMatch = typingFinalTone.match(tonePattern);
  if (!toneMatch) {
    return { success: false, message: '未识别声调' };
  }

  const tone = toneMatch[0];
  const final = typingFinalTone.slice(0, typingFinalTone.length - tone.length);

  if (!(initial in yngpingIPAInitialMap)) {
    return { success: false, message: '声母不合法' };
  }

  return { success: true, value: `${initial}${final}${tone}` };
}

function convertIPAToTyping(syllable: string): ConvertResult {
  const sanitized = syllable.replace(/\//g, '').trim();
  if (!sanitized) {
    return { success: false, message: '音节为空' };
  }

  const toneEntry = ipaToneEntries.find((entry) =>
    sanitized.endsWith(entry.ipa)
  );
  if (!toneEntry) {
    return { success: false, message: '未识别的声调' };
  }

  const tone = toneEntry.tone;
  let remaining = sanitized.slice(0, sanitized.length - toneEntry.ipa.length);

  let initial = '';
  let finalBody = remaining;

  const initialEntry = ipaInitialEntries.find(
    (entry) => entry.ipa && remaining.startsWith(entry.ipa)
  );

  if (initialEntry) {
    initial = initialEntry.typing;
    finalBody = remaining.slice(initialEntry.ipa.length);
  }

  if (!initialEntry && finalBody === remaining) {
    initial = '';
  }

  const finalTyping = ipaFinalMap[finalBody];
  if (!finalTyping) {
    return { success: false, message: '未识别的韵母' };
  }

  return { success: true, value: `${initial}${finalTyping}${tone}` };
}
</script>

<style scoped>
.convert-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px 60px;
}

.convert-title {
  text-align: center;
  margin-bottom: 32px;
  color: #262626;
}

.convert-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 960px) {
  .convert-content {
    flex-direction: row;
    align-items: stretch;
  }
}

.convert-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-title {
  font-weight: 600;
  color: #555;
}

.scheme-select {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  min-width: 140px;
}

.convert-input {
  width: 100%;
  height: 240px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
}

.convert-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.15);
}

.convert-result {
  width: 100%;
  min-height: 240px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  background-color: #fafafa;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.result-token {
  display: inline;
  color: #1f2329;
}

.result-token--error {
  color: #d93025;
  background: #fdecea;
  border-radius: 4px;
  padding: 0 4px;
}

.result-token--whitespace {
  white-space: pre;
}

.result-placeholder {
  color: #999;
  margin: 0;
}

.error-hint {
  margin-top: 12px;
  font-size: 14px;
  color: #d93025;
}

.error-items {
  font-weight: 500;
}
</style>