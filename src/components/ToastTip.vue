<template>
  <div
    ref="tipCard"
    class="fixed bottom-0 left-0 right-0 z-50 -mb-12 flex justify-center"
  >
    <div
      class="flex flex-row items-center gap-1 rounded-lg bg-white px-6 py-3 font-medium text-wheat-800 shadow-lg"
    >
      <i-material-symbols-check-circle-rounded class="text-green-600" />
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTimeline } from 'animejs';

const tipCard = ref<HTMLElement | null>(null);

const tip = () => {
  if (!tipCard.value) return;
  createTimeline()
    .add(tipCard.value, {
      translateY: '-350%',
      opacity: 1,
      duration: 300,
      ease: 'easeOutQuad',
    })
    .add(tipCard.value, {
      opacity: { to: 0 },
      duration: 1000,
      ease: 'easeInQuad',
      delay: 500,
      onComplete: () => {
        if (tipCard.value) {
          tipCard.value.style.transform = 'inherit';
        }
      },
    });
};

defineExpose({
  tip,
});
</script>
