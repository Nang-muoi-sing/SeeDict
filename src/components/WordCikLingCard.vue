<template>
  <div
    v-if="processedEntries?.length > 0"
    class="mb-5 mt-2 rounded-lg bg-white px-8 py-6"
  >
    <div class="mb-2 space-y-2">
      <WordCikLingEntry
        v-for="(cikling, index) in processedEntries"
        :data="cikling"
        :key="index"
      ></WordCikLingEntry>
    </div>
    <div class="space-y-1 text-rosybrown-800">
      <template
        v-for="(liAnnotation, _) in processedLiAnnotations"
        :key="_"
        ><p>
          <Badge
            v-for="(liAnnotationOrder, orderIndex) in liAnnotation.order"
            :key="orderIndex"
            >{{ liAnnotationOrder }}</Badge
          >{{ liAnnotation.content }}
        </p>
      </template>
    </div>

    <p class="mt-2 flex justify-end text-sm text-rosybrown-200">
      李如龙, 王升魁. 戚林八音校注. 福州: 福建人民出版社, 2001.
    </p>
    <template v-if="props.isCommentedCikLing">
      <hr class="my-2 border-t-2 border-rosybrown-100" />
      <div class="space-y-1 text-rosybrown-800">
        <template v-for="(cikling, index) in processedEntries" :key="index"
          ><p v-if="cikling.comment">
            <SeeSymbol class="text-rosybrown-700">校注</SeeSymbol>
            <FormatText :text="cikling.comment" />
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toneCikLingMap } from '../utils/mapping';
import type { WordCikLing } from '../utils/typing';
import Badge from './common/Badge.vue';
import SeeSymbol from './common/SeeSymbol.vue';
import WordCikLingEntry from './WordCikLingEntry.vue';
import FormatText from './common/FormatText.vue';
const props = defineProps<{
  data: WordCikLing[];
  isCommentedCikLing: boolean;
}>();

const processedEntries = computed(() => {
  return props.data.map((item) => {
    const tone = toneCikLingMap[item.tone];

    return {
      ...item,
      tone,
    };
  });
});

interface CikLingLiAnnotation {
  content: string;
  order: Set<string>;
}

const processedLiAnnotations = computed(() => {
  const annotationGroups: Record<string, CikLingLiAnnotation> = {};

  props.data.forEach((item) => {
    const cikOrder = `${item.cikFinal} ${item.liAnnotateCikOrder}`;
    const lingOrder = `${item.lingFinal} ${item.liAnnotateLingOrder}`;

    if (item.liAnnotateCik) {
      if (!annotationGroups[item.liAnnotateCik]) {
        annotationGroups[item.liAnnotateCik] = {
          content: item.liAnnotateCik,
          order: new Set([cikOrder]),
        };
      } else {
        annotationGroups[item.liAnnotateCik].order.add(cikOrder);
      }
    }

    if (item.liAnnotateLing) {
      if (!annotationGroups[item.liAnnotateLing]) {
        annotationGroups[item.liAnnotateLing] = {
          content: item.liAnnotateLing,
          order: new Set([lingOrder]),
        };
      } else {
        annotationGroups[item.liAnnotateLing].order.add(lingOrder);
      }
    }
  });

  return Object.values(annotationGroups).map((group) => ({
    content: removeNumber(group.content),
    order: Array.from(group.order),
  }));
});

const removeNumber = (str: string) => {
  return str.replace(/\d+$/, '').trim();
};
</script>
