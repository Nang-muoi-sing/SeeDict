<template>
  <ol class="list-none" :class="path.length === 0 ? 'pl-0' : 'pl-2 md:pl-6'">
    <li v-for="(node, index) in nodes" :key="index" class="mb-2">
      <ExplNode
        :node="node"
        :index="index + 1"
        :path="path"
        :currentGlyph="currentGlyph"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
import ExplNode from './ExplNode.vue';
import type { FengExplNode } from '../../utils/typing';

defineProps<{
  nodes: FengExplNode[];
  path: number[]; // 当前层级路径（ [1, 2] 表示 1.2）
  currentGlyph?: 'first' | 'second';
}>();
</script>
