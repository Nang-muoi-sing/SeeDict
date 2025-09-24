<template>
  <div
    class="text-rosybrown-800 mt-2 mb-5 flex flex-wrap gap-3 rounded-lg bg-white px-8 py-6"
  >
    <p v-if="processedData.phonologyTone">
      <Badge>音韵地位</Badge>{{ processedData.phonologyInitial
      }}{{ processedData.phonologyFinal }}{{ processedData.phonologyTone }}
    </p>
    <p v-if="processedData.banguace">
      <Badge>教会罗马字</Badge>{{ processedData.banguace }}
    </p>
    <p v-if="processedData.ipa"><Badge>国际音标</Badge>/{{ processedData.ipa }}/</p>
    <p v-if="processedData.yngping">
      <Badge>榕拼键入</Badge
      ><span v-html="makeYngpingsSup(processedData.yngping)"></span>
    </p>
    <p v-if="processedData.yngping">
      <Badge>榕拼手写</Badge
      ><span v-html="yngpingToCursive(processedData.yngping)"></span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toneCikLingMap } from '../utils/mapping';
import {
  yngpingToIPA,
  yngpingToCursive,
  phonologyToBanguace,
  makeYngpingsSup
} from '../utils/phonetics';
import type { Phonetics } from '../utils/typing';
import Badge from './Badge.vue';

const props = defineProps<{
  data: Phonetics;
}>();

const processedData = computed(() => {
  const toneHan = props.data.phonologyTone
    ? toneCikLingMap[props.data.phonologyTone]
    : props.data.phonologyTone;

  const ipa = yngpingToIPA(props.data.yngping);
  const banguace =
    props.data.phonologyInitial && props.data.phonologyFinal && toneHan
      ? phonologyToBanguace(
          props.data.phonologyInitial,
          props.data.phonologyFinal,
          toneHan
        )
      : '';

  return {
    ...props.data,
    phonologyTone: toneHan,
    ipa: ipa,
    banguace: banguace,
  };
});
</script>
