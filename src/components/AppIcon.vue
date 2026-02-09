<template>
  <div class="group inline-flex flex-col items-center">
    <div
      class="rounded-xl bg-wheat-50 p-1 text-[48px] text-rosybrown-600 transition-colors duration-100 group-first-of-type:hover:text-rosybrown-700 group-hover:bg-wheat-100"
    >
      <slot>
        <i-material-symbols-accessibility-new />
      </slot>
    </div>

    <div
      class="w-full min-w-0 max-w-[64px] truncate pt-1 text-center text-xs text-rosybrown-800"
      :title="name"
    >
      {{ props.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>
