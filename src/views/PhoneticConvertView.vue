<template>
  <PageContent :show-search-bar="false">
    <div>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText :text="'工具'" :yngping="'geoyng55 geoy242'"></RubyText>
      </div>
      <div class="space-y-2 text-sm font-semibold text-rosybrown-600">
        <p>
          在榕拼键入、榕拼手写与国际音标之间实时转换，逐个音节校验并提示错误，帮助你快速完成不同注音方案之间的互换。
        </p>
      </div>
    </div>

    <div class="relative mb-16 mt-5 space-y-5 rounded-lg bg-white">
      <div
        class="absolute flex w-full items-center justify-between gap-1 px-6 pt-5"
      >
        <select
          v-model="sourceScheme"
          class="w-full rounded-lg border border-wheat-200 bg-wheat-50/50 px-3 py-1.5 font-plain text-sm text-rosybrown-700 ring-wheat-200 transition hover:border-wheat-400"
        >
          <option
            v-for="option in schemeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <div
          class="mx-2 rounded-full bg-white text-rosybrown-700 ring-8 ring-wheat-50"
        >
          <i-mi-switch class="m-2" />
        </div>

        <select
          v-model="targetScheme"
          class="w-full rounded-lg border border-wheat-200 bg-wheat-50/50 px-3 py-1.5 font-plain text-sm text-rosybrown-700 ring-wheat-200 transition hover:border-wheat-400"
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
      <div class="flex w-full flex-col lg:flex-row">
        <div
          class="my-3 ml-3 mr-3 flex flex-1 flex-col rounded-xl bg-wheat-50 pt-16 lg:mr-0"
        >
          <TextareaCard
            ref="inputArea"
            :placeholder="placeholders[sourceScheme]"
            :placeholder-class="'px-6 text-3xl font-bold text-wheat-600/50 leading-relaxed'"
            :input-area-class="{
              'h-full min-h-[10rem] w-full break-all px-6 leading-relaxed text-rosybrown-800 lg:min-h-[20rem]': true,
              'text-3xl font-bold': inputText.length < 120,
              'text-xl font-bold':
                inputText.length >= 120 && inputText.length < 280,
            }"
          ></TextareaCard>
          <div class="bg-red mt-auto px-6 py-3">
            <button
              @click="handleDeleteClick"
              class="rounded-lg bg-wheat-100 p-1.5 text-wheat-500 duration-300 hover:bg-wheat-200 active:bg-wheat-200"
            >
              <i-material-symbols-delete />
            </button>
          </div>
        </div>

        <div
          class="my-3 ml-3 mr-3 flex flex-1 flex-col rounded-xl bg-white lg:pl-0 lg:pt-16"
        >
          <div
            class="h-full min-h-[10rem] w-full break-all px-6 leading-relaxed text-rosybrown-800 lg:min-h-[20rem]"
            :class="{
              'text-3xl font-bold': inputText.length < 120,
              'text-xl font-bold':
                inputText.length >= 120 && inputText.length < 280,
            }"
          >
            <template v-if="hasResultContent">
              <template v-for="(token, index) in resultTokens" :key="index">
                <span
                  :tabindex="
                    token.type === 'error' && token.message ? 0 : undefined
                  "
                  :data-tooltip-target="
                    token.type === 'error' && token.message
                      ? `tooltip-${index}`
                      : undefined
                  "
                  class="inline text-rosybrown-800"
                  :class="{
                    'cursor-pointer rounded-md bg-rose-50 px-1 ring-1 ring-rose-100':
                      token.type === 'error',
                    'whitespace-pre-wrap': token.type === 'whitespace',
                  }"
                >
                  {{ token.text }}
                </span>
                <div
                  v-if="token.type === 'error' && token.message"
                  :id="`tooltip-${index}`"
                  role="tooltip"
                  class="tooltip invisible absolute z-50 inline-block rounded-xl bg-rosybrown-900 px-3 py-2 text-sm text-wheat-50 opacity-0 transition-opacity duration-500"
                >
                  {{ token.message }}
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </template>
            </template>
            <span
              v-else
              class="select-none text-3xl font-bold text-wheat-600/50"
            >
              {{ placeholders[targetScheme] }}
            </span>
          </div>
          <div class="mt-auto px-6 py-3">
            <button
              @click="handleCopyClick"
              class="rounded-lg bg-wheat-100 p-1.5 text-wheat-500 duration-300 hover:bg-wheat-200 active:bg-wheat-200"
            >
              <i-material-symbols-content-copy />
            </button>
          </div>
          <ToastTip ref="copyTip">已复制结果</ToastTip>
        </div>
      </div>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { initTooltips } from 'flowbite';
import { computed, ref, watch } from 'vue';
import PageContent from '../components/PageContent.vue';
import TextareaCard from '../components/TextareaCard.vue';
import ToastTip from '../components/ToastTip.vue';
import {
  yngpingIPAFinalMap,
  yngpingIPAInitialMap,
  yngpingIPAToneMap,
  yngpingTypingCursiveFinalToneMap,
} from '../utils/mapping';
import {
  makeYngpingCursive,
  yngpingInitialPattern,
  yngpingToIPA,
} from '../utils/phonetics';

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
  typing: 'huk21 ziu53 ua242',
  cursive: 'hǔk zìu uâ',
  ipa: 'huʔ˨˩ t͡siu˥˧ ua˨˦˨',
};

const tonePattern = /\d+$/;
const sourceScheme = ref<Scheme>('typing');
const targetScheme = ref<Scheme>('cursive');
const inputArea = ref<InstanceType<typeof TextareaCard> | null>(null);
const copyTip = ref<InstanceType<typeof ToastTip> | null>(null);

const inputText = computed(() => {
  return inputArea.value?.data?.() || '';
});

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

const tokenize = (text: string): string[] => text.match(/\s+|\S+/g) ?? [];

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

const handleDeleteClick = () => {
  inputArea.value?.clear();
};

const handleCopyClick = async () => {
  const content = resultTokens.value.map((token) => token.text).join('');
  if (!content) return;
  try {
    await navigator.clipboard.writeText(content);
    copyTip.value?.tip();
  } catch (err) {
    console.error('复制失败:', err);
  }
};

watch(
  () => resultTokens.value,
  () => {
    setTimeout(() => {
      initTooltips();
    }, 0);
  },
  { deep: true }
);
</script>
