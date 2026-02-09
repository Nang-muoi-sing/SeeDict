<template>
  <PageContent :show-search-bar="false">
    <div>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText :text="'工具'" :yngping="'geoyng53 geoy242'"></RubyText>
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
              class="origin-center rounded-lg bg-wheat-100 p-1.5 text-wheat-500 transition-transform duration-300 hover:bg-wheat-200 active:scale-95"
            >
              <i-material-symbols-delete
                class="scale-100 transition-transform duration-300 active:scale-95"
              />
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
              class="origin-center rounded-lg bg-wheat-100 p-1.5 text-wheat-500 transition-transform duration-300 hover:bg-wheat-200 active:scale-95"
            >
              <i-material-symbols-content-copy
                class="scale-100 transition-transform duration-300 active:scale-95"
              />
            </button>
          </div>
          <ToastTip ref="copyTip">已复制结果</ToastTip>
        </div>
      </div>
    </div>

    <div class="mb-16 rounded-2xl border border-wheat-200 bg-white p-6">
      <div class="mb-4 text-lg font-semibold text-rosybrown-700">
        福州话亲戚称呼计算器
      </div>
      <div class="space-y-3">
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-rosybrown-600"
        >
          <div class="font-semibold text-rosybrown-600">我的性别：</div>
          <label class="flex items-center gap-2">
            <input
              v-model="relationSex"
              type="radio"
              :value="1"
              class="h-4 w-4 accent-rosybrown-600"
            />
            男
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="relationSex"
              type="radio"
              :value="0"
              class="h-4 w-4 accent-rosybrown-600"
            />
            女
          </label>
        </div>
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-rosybrown-600"
        >
          <div class="font-semibold text-rosybrown-600">称呼方式：</div>
          <label class="flex items-center gap-2">
            <input
              v-model="relationReverse"
              type="radio"
              :value="false"
              class="h-4 w-4 accent-rosybrown-600"
            />
            我称呼对方
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="relationReverse"
              type="radio"
              :value="true"
              class="h-4 w-4 accent-rosybrown-600"
            />
            对方称呼我
          </label>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-wheat-200 bg-white">
        <textarea
          v-model="relationText"
          rows="4"
          placeholder="称呼之间用“的”字分开..."
          class="w-full resize-none rounded-xl border-0 bg-transparent p-4 text-sm text-rosybrown-700 outline-none placeholder:text-wheat-600/50"
        ></textarea>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="item in relationQuickKeys"
          :key="item.label"
          type="button"
          :disabled="isRelationQuickKeyDisabled(item.label)"
          class="flex h-9 w-12 items-center justify-center rounded-md bg-wheat-100 text-sm font-semibold text-rosybrown-700"
          :class="{
            'hover:bg-wheat-200': !isRelationQuickKeyDisabled(item.label),
            'cursor-not-allowed opacity-50': isRelationQuickKeyDisabled(
              item.label
            ),
          }"
          @click="handleRelationQuickInsert(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-lg bg-wheat-300 px-6 py-2 text-sm font-semibold text-white hover:bg-wheat-400"
          @click="handleRelationBackspace"
        >
          回退
        </button>
        <button
          type="button"
          class="rounded-lg bg-rosybrown-300 px-6 py-2 text-sm font-semibold text-white hover:bg-rosybrown-400"
          @click="handleRelationClear"
        >
          清空
        </button>
        <button
          type="button"
          class="rounded-lg bg-wheat-600 px-6 py-2 text-sm font-semibold text-white hover:bg-wheat-700"
          @click="handleRelationCalculate"
        >
          计算
        </button>
      </div>

      <div class="mt-6 text-sm font-semibold text-rosybrown-600">
        计算结果：
      </div>
      <div
        class="mt-2 min-h-[160px] rounded-xl border border-wheat-200 bg-white p-4 text-sm text-rosybrown-700"
      >
        <div v-if="relationHasError" class="text-rosybrown-600">
          {{ relationError }}
        </div>
        <div v-else-if="relationHasResult">
          <div class="text-xs font-semibold text-wheat-500">普通话称呼</div>
          <div class="mt-1 text-lg font-semibold text-rosybrown-800">
            {{ relationMandarin }}
          </div>
          <div class="mt-4 text-xs font-semibold text-wheat-500">
            福州话称呼
          </div>
          <div
            v-if="relationFuzhouItems.length === 0"
            class="mt-2 text-wheat-500"
          >
            暂无福州话称呼。
          </div>
          <div v-else class="mt-2 space-y-2">
            <div
              v-for="item in relationFuzhouItems"
              :key="`${item.name}-${item.reading}`"
              class="flex items-center justify-between rounded-lg bg-wheat-50 px-3 py-2"
            >
              <div>
                <div class="text-sm font-semibold text-rosybrown-800">
                  {{ item.name }}
                </div>
                <div class="text-xs text-wheat-500">
                  {{ item.reading || '读音待补充' }}
                </div>
              </div>
              <button
                type="button"
                :disabled="!item.audioUrls.length"
                class="flex items-center gap-1 text-wheat-400"
                :class="{
                  'cursor-not-allowed opacity-60': !item.audioUrls.length,
                  'text-rosybrown-600 hover:text-rosybrown-700':
                    item.audioUrls.length,
                }"
                @click="handleRelationPlay(item.audioUrls)"
              >
                <i-material-symbols-play-circle-rounded class="text-xl" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-wheat-500">暂无结果。</div>
      </div>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import relationship from 'relationship.js';
import { parseYngping } from '../utils/phonetics';
import { initTooltips } from 'flowbite';
import { computed, ref, watch } from 'vue';
import PageContent from '../components/PageContent.vue';
import TextareaCard from '../components/TextareaCard.vue';
import ToastTip from '../components/ToastTip.vue';
import { getFuzhouTerms, type FuzhouTerm } from '../utils/relationshipMapping';
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
  if (!converted) {
    return {
      text: fragment,
      raw: fragment,
      type: 'error',
      message: '未识别音节',
    };
  }

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
  const toneMatch = syllable.match(tonePattern);
  if (!toneMatch) {
    return { success: false, message: '缺少声调' };
  }

  const letterPart = syllable.slice(0, syllable.length - toneMatch[0].length);
  if (!letterPart) {
    return { success: false, message: '缺少韵母' };
  }

  const [initial, final, tone] = parseYngping(syllable);

  if (initial === null) {
    return { success: false, message: '声母不合法' };
  }

  if (final === null) {
    return { success: false, message: '韵母不合法' };
  }

  if (tone === null) {
    return { success: false, message: '声调不合法' };
  }

  return { success: true, value: `${initial}${final}${tone}` };
}

function convertCursiveToTyping(syllable: string): ConvertResult {
  const initialMatch = syllable.match(yngpingInitialPattern);
  let initial = initialMatch ? initialMatch[0] : '';
  let finalPart = syllable.slice(initial.length);

  if (initial === 'ng' && !finalPart) {
    initial = '';
    finalPart = 'ng';
  }

  if (!finalPart) {
    return { success: false, message: '缺少韵母' };
  }

  const typingFinalTone = cursiveToTypingMap[finalPart];
  if (!typingFinalTone) {
    return { success: false, message: '未识别韵母' };
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
    return { success: false, message: '未识别声调' };
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
    return { success: false, message: '未识别韵母' };
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

const relationText = ref('');
const relationSex = ref<0 | 1>(1);
const relationReverse = ref(false);
const relationQuickKeys = [
  { label: '父', value: '爸爸' },
  { label: '母', value: '妈妈' },
  { label: '夫', value: '老公' },
  { label: '妻', value: '老婆' },
  { label: '兄', value: '哥哥' },
  { label: '弟', value: '弟弟' },
  { label: '姐', value: '姐姐' },
  { label: '妹', value: '妹妹' },
  { label: '子', value: '儿子' },
  { label: '女', value: '女儿' },
] as const;
type Gender = 'male' | 'female';
const maleQuickKeyLabels = new Set<string>(['父', '夫', '兄', '弟', '子']);
const femaleQuickKeyLabels = new Set<string>(['母', '妻', '姐', '妹', '女']);
const maleRelationTerms = new Set<string>(
  relationQuickKeys
    .filter((item) => maleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);
const femaleRelationTerms = new Set<string>(
  relationQuickKeys
    .filter((item) => femaleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);

type RelationResult = { mandarin: string } | { error: string };

const relationResult = ref<RelationResult | null>(null);
const relationAudioBaseUrl = `${import.meta.env.VITE_OSS_URL}/audio/relatives`;

const isErrorResult = (
  value: RelationResult | null
): value is { error: string } => !!value && 'error' in value;
const isMandarinResult = (
  value: RelationResult | null
): value is { mandarin: string } => !!value && 'mandarin' in value;

const relationHasError = computed(() => isErrorResult(relationResult.value));
const relationHasResult = computed(() =>
  isMandarinResult(relationResult.value)
);
const relationError = computed(() =>
  isErrorResult(relationResult.value) ? relationResult.value.error : ''
);
const relationMandarin = computed(() =>
  isMandarinResult(relationResult.value) ? relationResult.value.mandarin : ''
);

const buildFuzhouAudioUrls = (reading: string): string[] => {
  if (!reading) return [];
  const readings = reading
    .split('/')
    .map((item) => item.replace(/\s+/g, '').trim())
    .filter(Boolean);
  return readings.map(
    (item) =>
      `${relationAudioBaseUrl}/${encodeURIComponent(item.toLowerCase())}.mp3`
  );
};

const relationFuzhouItems = computed(() => {
  if (!relationHasResult.value) {
    return [] as (FuzhouTerm & { audioUrls: string[] })[];
  }
  return getFuzhouTerms(relationMandarin.value).map((term) => ({
    ...term,
    audioUrls: buildFuzhouAudioUrls(term.reading),
  }));
});

const getLastRelationSegment = () => {
  const trimmed = relationText.value.trim();
  if (!trimmed) return '';
  const segments = trimmed
    .split('的')
    .map((item) => item.trim())
    .filter(Boolean);
  return segments.length ? segments[segments.length - 1] : '';
};

const getCurrentRelationGender = (): Gender | null => {
  const lastSegment = getLastRelationSegment();
  if (!lastSegment) {
    return relationSex.value === 1 ? 'male' : 'female';
  }
  if (maleRelationTerms.has(lastSegment)) return 'male';
  if (femaleRelationTerms.has(lastSegment)) return 'female';
  return null;
};

const isRelationQuickKeyDisabled = (label: string) => {
  const gender = getCurrentRelationGender();
  if (!gender) return false;
  if (label === '夫') return gender === 'male';
  if (label === '妻') return gender === 'female';
  return false;
};

const handleRelationQuickInsert = (name: string) => {
  if (name === '老公' && isRelationQuickKeyDisabled('夫')) return;
  if (name === '老婆' && isRelationQuickKeyDisabled('妻')) return;
  const trimmed = relationText.value.trim();
  relationText.value = trimmed ? `${trimmed}的${name}` : name;
};

const handleRelationBackspace = () => {
  const trimmed = relationText.value.trim();
  if (!trimmed) {
    relationText.value = '';
    return;
  }
  const segments = trimmed.split('的');
  segments.pop();
  relationText.value = segments.join('的');
};

const handleRelationClear = () => {
  relationText.value = '';
  relationResult.value = null;
};

const handleRelationCalculate = () => {
  const trimmed = relationText.value.trim();
  if (!trimmed) {
    relationResult.value = { error: '请输入称呼。' };
    return;
  }
  const results = relationship({
    text: trimmed,
    sex: relationSex.value,
    reverse: relationReverse.value,
  });
  const mandarin = Array.isArray(results) ? results[0] : '';
  if (!mandarin) {
    relationResult.value = { error: '未找到结果。' };
    return;
  }
  relationResult.value = {
    mandarin,
  };
};

const playRelationAudio = (audioUrls: string[], index = 0) => {
  if (index >= audioUrls.length) {
    console.error('播放失败: 未找到可用音频');
    return;
  }
  const audio = new Audio(audioUrls[index]);
  audio.addEventListener(
    'error',
    () => {
      playRelationAudio(audioUrls, index + 1);
    },
    { once: true }
  );
  audio.play().catch((err) => {
    console.error('播放失败:', err);
  });
};

const handleRelationPlay = (audioUrls: string[]) => {
  if (!audioUrls.length) return;
  playRelationAudio(audioUrls);
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
