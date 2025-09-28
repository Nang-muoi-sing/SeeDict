<template>
  <div>
    <div class="flex flex-col">
      <div class="rounded-xl px-5 py-3" :class="props.bubbleClass">
        <slot></slot>
      </div>
      <div class="flex flex-row" :class="{ 'justify-end': !props.leftArrow }">
        <div
          class="relative mx-5 h-3 w-7 border-t-8 border-r-14 border-b-8 border-l-14 border-r-transparent border-b-transparent border-l-transparent"
          :class="props.arrowClass"
        ></div>
      </div>
    </div>
    <div v-if="avatarUrl" class="relative ml-[.875rem]">
      <div class="flex flex-row items-center space-x-3">
        <img
          class="h-10 w-10 rounded-full border-4 border-white object-cover"
          :src="avatarUrl"
          alt="Avatar"
        />
        <template v-if="nickname">
          <span class="text-md font-semibold text-zinc-600">{{
            nickname
          }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  leftArrow?: boolean;
  bubbleClass?: string;
  arrowClass?: string;
  avatarUrl?: string;
  nickname?: string;
}

const props = withDefaults(defineProps<Props>(), {
  leftArrow: true,
  bubbleClass: 'bg-rosybrown-100',
  arrowClass: 'border-t-rosybrown-100',
});
</script>
