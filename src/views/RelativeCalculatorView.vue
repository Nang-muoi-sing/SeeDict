<template>
  <PageContent :show-search-bar="false">
    <div>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText
          :text="'称呼计算'"
          :yngping="'cing55 hu55 gie53 looung213'"
        ></RubyText>
      </div>
      <div class="space-y-2 text-sm font-semibold text-rosybrown-600">
        <p>
          不知道这位亲戚如何称呼？输入自身性别和亲属关系，快速为你匹配福州话中的对应亲属称呼。
        </p>
      </div>
    </div>

    <div class="mb-16 mt-5 rounded-2xl border border-wheat-200 bg-white p-6">
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
          placeholder="称呼之间用「的」字分开..."
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
import { computed, ref } from 'vue';
import PageContent from '../components/PageContent.vue';
import { getFuzhouTerms, type FuzhouTerm } from '../utils/relationshipMapping';

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
type RelationQuickValue = (typeof relationQuickKeys)[number]['value'];
const maleQuickKeyLabels = new Set(['父', '夫', '兄', '弟', '子']);
const femaleQuickKeyLabels = new Set(['母', '妻', '姐', '妹', '女']);
const maleRelationTerms = new Set<RelationQuickValue>(
  relationQuickKeys
    .filter((item) => maleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);
const femaleRelationTerms = new Set(
  relationQuickKeys
    .filter((item) => femaleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);

type RelationResult = { mandarin: string } | { error: string };

const relationResult = ref<RelationResult | null>(null);
const relationFuzhouMandarin = ref('');
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
  const mandarinForFuzhou = relationFuzhouMandarin.value || relationMandarin.value;
  return getFuzhouTerms(mandarinForFuzhou).map((term) => ({
    ...term,
    audioUrls: buildFuzhouAudioUrls(term.reading),
  }));
});

const shouldKeepSpouseParentPrefix = (text: string) => {
  return /^(老公|老婆)的(爸爸|妈妈)$/.test(text.trim());
};

const getFuzhouCalculationText = (text: string) => {
  if (shouldKeepSpouseParentPrefix(text)) return text;
  return text.replace(/^(老公|老婆)的/, '');
};

const calculateMandarinRelation = (text: string) => {
  const results = relationship({
    text,
    sex: relationSex.value,
    reverse: relationReverse.value,
  });
  return Array.isArray(results) ? results[0] || '' : '';
};

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
  if (maleRelationTerms.has(lastSegment as RelationQuickValue)) return 'male';
  if (femaleRelationTerms.has(lastSegment as RelationQuickValue))
    return 'female';
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
  relationFuzhouMandarin.value = '';
};

const handleRelationCalculate = () => {
  const trimmed = relationText.value.trim();
  if (!trimmed) {
    relationResult.value = { error: '请输入称呼。' };
    relationFuzhouMandarin.value = '';
    return;
  }
  const mandarin = calculateMandarinRelation(trimmed);
  if (!mandarin) {
    relationResult.value = { error: '未找到结果。' };
    relationFuzhouMandarin.value = '';
    return;
  }
  const fuzhouText = getFuzhouCalculationText(trimmed);
  const fuzhouMandarin =
    fuzhouText === trimmed ? mandarin : calculateMandarinRelation(fuzhouText);
  relationFuzhouMandarin.value = fuzhouMandarin || mandarin;
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
</script>
