<template>
  <h2
    :id="props.text"
    class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-5 p-1 text-xl font-bold"
  >
    {{ props.text }}
  </h2>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  text: string;
}>();
</script>
