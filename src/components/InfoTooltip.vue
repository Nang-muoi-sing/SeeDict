<template>
  <div
    :id="props.id"
    role="tooltip"
    class="tooltip invisible absolute z-50 inline-block rounded-xl bg-rosybrown-900 px-3 py-2 text-sm text-wheat-50 opacity-0 transition-opacity duration-500"
  >
    <slot></slot>
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();
</script>
