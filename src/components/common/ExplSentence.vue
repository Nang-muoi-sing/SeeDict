<template>
  <li class="flex items-start text-wheat-400">
    <span class="before:content-['■'] before:mr-2"
      ><FormatText
        :text="props.sentence"
        :glyph-mode="props.currentGlyph"
        marked-class="after:bg-wheat-400"
    /></span>
  </li>
</template>

<script setup lang="ts">
import FormatText from './FormatText.vue';
interface Props {
  sentence: string;
  currentGlyph?: 'original' | 'canonical';
}

const props = withDefaults(defineProps<Props>(), {
  currentGlyph: 'canonical',
});
</script>
