<template>
  <div>
    <p>
      <span class="mr-2 font-semibold">{{ generateNumber() }}</span>
      <SeeSymbol v-if="node.lexical">{{ node.lexical }}</SeeSymbol>
      {{ processedExpl }}
    </p>

    <ul v-if="node.sent?.length" class="mt-1 list-none space-y-1 pl-2 md:pl-6">
      <ExplSentence
        v-for="(sent, i) in node.sent"
        :key="i"
        :sentence="sent"
        :currentGlyph="currentGlyph"
      />
    </ul>

    <ExplNodeList
      v-if="node.node?.length"
      :nodes="node.node"
      :path="currentPath"
      :currentGlyph="currentGlyph"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ExplNodeList from './ExplNodeList.vue';
import ExplSentence from './ExplSentence.vue';
import { parseText, correctStops } from '../../utils/typography';
import type { FengExplNode } from '../../utils/typing';
import SeeSymbol from './SeeSymbol.vue';

const props = defineProps<{
  node: FengExplNode;
  index: number;
  path: number[];
  currentGlyph?: 'first' | 'second';
}>();

// 生成当前节点的完整路径（父路径 + 自身索引）
const currentPath = computed(() => [...props.path, props.index]);

// 生成编号（[1,2] → "1.2. "）
const generateNumber = () => {
  return currentPath.value.join('.') + '. ';
};

const processedExpl = computed(() => {
  return correctStops(parseText(props.node.expl, props.currentGlyph));
});
</script>
