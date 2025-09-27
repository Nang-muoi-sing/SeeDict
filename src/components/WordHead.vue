<template>
  <div
    class="bg-wheat-100 before:bg-wheat-200 relative z-10 mt-5 mb-8 cursor-pointer overflow-hidden rounded-lg px-8 py-6 transition-all duration-300 ease-in-out before:absolute before:top-[100%] before:left-[100%] before:-z-10 before:h-300 before:w-300 before:rounded-full before:transition-all before:duration-700 before:content-[''] hover:before:-top-50 hover:before:-left-50 active:scale-95 active:before:transition-colors active:before:duration-0"
    @click.prevent="handleClick"
  >
    <div
      class="pointer-events-none absolute rounded-full bg-white/30 transition-all duration-800"
    ></div>

    <div
      class="text-rosybrown-800 text-4xl font-bold break-all whitespace-normal md:text-5xl"
    >
      <RubyText :text="props.text" :yngping="props.yngping"></RubyText>
    </div>
  </div>
  <div
    ref="copyTip"
    class="flex-inline text-wheat-800 fixed -bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-white px-6 py-3 font-medium shadow-lg"
  >
    <i-material-symbols-check-circle-rounded class="text-green-600" />
    已复制词条
  </div>
</template>

<script setup lang="ts">
import { createTimeline } from 'animejs';
import { ref } from 'vue';
import RubyText from './common/RubyText.vue';

const props = defineProps<{
  text: string;
  yngping: string;
}>();

const copyTip = ref<HTMLElement | null>(null);

const handleClick = async () => {
  try {
    const textToCopy = props.text.replace('*', '');
    await navigator.clipboard.writeText(textToCopy);

    if (copyTip.value) {
      createTimeline()
        .add(copyTip.value, {
          translateY: '-350%',
          opacity: 1,
          duration: 300,
          ease: 'easeOutQuad',
        })
        .add(copyTip.value, {
          opacity: { to: 0 },
          duration: 1000,
          ease: 'easeInQuad',
          delay: 500,
          onComplete: () => {
            if (copyTip.value) {
              copyTip.value.style.transform = 'inherit';
            }
          },
        });
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
};
</script>
