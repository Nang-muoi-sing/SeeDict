<template>
  <div
    class="text-rosybrown-800 flex flex-row justify-center text-5xl font-bold"
  >
    <RubyText :text="props.text" :yngping="props.yngping"></RubyText>
  </div>
</template>

<script setup lang="ts">
import RubyText from './common/RubyText.vue';

const props = defineProps<{
  text: string;
  yngping: string;
}>();
</script>
