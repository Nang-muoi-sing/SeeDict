<template>
  <div>
    <div v-html="parsedExplanations"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseText } from '../utils/typography';
import type { FengExplNode } from '../utils/typing';

interface Props {
  data: FengExplNode[];
  currentGlyph?: 'first' | 'second';
}

const props = withDefaults(defineProps<Props>(), {
  currentGlyph: 'second',
});

// 生成层级编号（如 1.1, 1.1.1）
const generateNumber = (path: number[]): string => path.join('.') + '. ';

const parseNestedExplanations = (
  explanations: FengExplNode[],
  path: number[] = []
): string => {
  return `<ol class="list-none ${path.length === 0 ? 'pl-0' : 'pl-2 md:pl-6'}">${explanations
    .map((item, index) => {
      const currentPath = [...path, index + 1];
      const lexicalIcon = item.lexical
        ? `<span
    class="seeicon- mr-1 inline-block align-text-bottom text-rosybrown-700"
    style="font-size: 20px; display: inline-block; width: 1em;"
    >${item.lexical}</span>`
        : '';
      const processedExpl = `${lexicalIcon}${parseText(item.expl, props.currentGlyph)}`;

      return `
    <li class="mb-2">
      <p class="flex items-start">
        <span class="font-semibold mr-2">${generateNumber(currentPath)}</span>
        <span>${processedExpl}</span>
      </p>

      ${
        item.sent?.length
          ? `<ul class="list-none pl-2 md:pl-6 mt-1 space-y-1">${item.sent
              .map((sent) => {
                // 替换例句中的 {A,B} 格式
                const processedSent = parseText(sent, props.currentGlyph);
                return `
          <li class="flex items-start text-wheat-400">
            <span class="mr-2">•</span>
            <span>${processedSent}</span>
          </li>
        `;
              })
              .join('')}</ul>`
          : ''
      }

      ${
        item.node?.length ? parseNestedExplanations(item.node, currentPath) : ''
      }
    </li>
  `;
    })
    .join('')}</ol>`;
};

const parsedExplanations = computed(() => {
  return parseNestedExplanations(props.data);
});
</script>
