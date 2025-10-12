<template>
  <li class="flex items-start text-wheat-400">
    <span class="mr-2">•</span>
    <span>{{ processedSentence }}</span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseText, correctStops } from '../../utils/typography';

interface Props {
  sentence: string;
  currentGlyph?: 'first' | 'second';
}

const props = withDefaults(defineProps<Props>(), {
  currentGlyph: 'second',
});

// 处理例句文本（替换 {A,B} 格式）
const processedSentence = computed(() => {
  return correctStops(parseText(props.sentence, props.currentGlyph));
});
</script>
