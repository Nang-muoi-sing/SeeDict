<template>
  <div>
    <SpeechBubble
      :arrow-class="'border-t-rosybrown-100'"
      :bubble-class="'bg-rosybrown-100'"
      ><p class="text-rosybrown-900 text-sm">
        𬖞是福州人在冬至时制作的寓意团圆的美食，具有福州腔调，也很有榕城的烟火气
      </p></SpeechBubble
    >
    <SpeechBubble
      :left-arrow="false"
      :arrow-class="'border-t-wheat-100'"
      :bubble-class="'bg-wheat-100'"
      ><p class="text-rosybrown-900 text-sm">
        和做玻当𬖞一样，需要社会上每一分子都为福州话保护添上「芝麻」「豆粉」「白砂糖」，
        才能做大做强，把福州话保护好
      </p></SpeechBubble
    >
    <SpeechBubble
      :arrow-class="'border-t-rosybrown-200'"
      :bubble-class="'bg-rosybrown-200'"
      ><p class="text-rosybrown-900 text-sm">
        「𬖞」是在街头巷尾常见的方言字，我们的一大愿望也是让大家了解到我们的方言是能够写出来的
      </p></SpeechBubble
    >
    <SpeechBubble
      :left-arrow="false"
      :arrow-class="'border-t-wheat-200'"
      :bubble-class="'bg-wheat-200'"
      ><p class="text-rosybrown-900 text-sm">
        「𬖞」和英文的 see
        谐音，在平话和普通话里，「𬖞典」又和「词典」谐音，我们就是一部希望平话被更多人看见的词典
      </p></SpeechBubble
    >
  </div>
</template>

<script setup lang="ts">
import SpeechBubble from './SpeechBubble.vue';
</script>
