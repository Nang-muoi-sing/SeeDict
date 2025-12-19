<template>
  <span
    v-for="(char, index) in baldChars"
    :key="index"
    class="relative"
    :class="{
      'after:absolute after:-bottom-[0.05em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
        markedChars[index],
    }"
    >{{ char }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string;
}>();

const rawText = computed(() => props.text.trim());

const markedChars = computed<boolean[]>(() => {
  const chars = rawText.value.split(/(?:)/u);
  const marks = [];

  for (let index = 0; index < chars.length; index++) {
    if (chars[index] === '*') {
      continue;
    }

    if (index === chars.length - 1) {
      marks.push(false);
      continue;
    }

    if (chars[index + 1] === '*') {
      marks.push(true);
    } else {
      marks.push(false);
    }
  }
  return marks;
});

const baldText = computed(() => rawText.value.replace(/\*/g, ''));
const baldChars = computed(() => baldText.value.split(/(?:)/u));
</script>
