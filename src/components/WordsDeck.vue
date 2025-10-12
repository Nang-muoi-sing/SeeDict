<template>
  <div
    class="relative flex h-[40vh] min-h-[24rem] w-screen items-center justify-center overflow-hidden"
  >
    <div
      v-for="(spring, index) in springs"
      :key="cards[index].w"
      class="deck absolute flex touch-none items-center justify-center will-change-transform"
      :style="{ transform: `translate3d(${spring.x}px, ${spring.y}px, 0)` }"
    >
      <div
        @mousedown="onDragStart(index)"
        @mousemove="onDragMove(index, $event)"
        @mouseup="onDragEnd(index)"
        @mouseleave="onDragEnd(index)"
        @touchstart="onDragStart(index)"
        @touchmove="onDragMove(index, $event)"
        @touchend="onDragEnd(index)"
        class="relative h-60 w-[75vw] select-none rounded-xl border-[1px] border-solid border-wheat-200 bg-rosybrown-50 p-4 lg:h-64 lg:w-[30rem]"
      >
        <div class="h-1/1 font-sans">
          <span class="text-base italic text-wheat-400 lg:text-lg"
            >#汝会仈儥？</span
          >
          <div class="flex flex-col items-center space-y-5">
            <RouterLink
              class="block"
              :to="{ name: 'word', query: { w: cards[index].w } }"
            >
              <div
                class="whitespace-normal break-all text-3xl font-bold text-rosybrown-800 md:text-4xl lg:text-5xl"
              >
                <RubyText
                  :text="cards[index].text"
                  :yngping="cards[index].pron"
                ></RubyText></div
            ></RouterLink>
            <p
              class="line-clamp-4 lg:line-clamp-2 max-w-lg overflow-hidden text-ellipsis whitespace-normal text-base text-rosybrown-800 lg:text-lg"
            >
              释义：{{ cards[index].expl }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { computed, onMounted, reactive, ref } from 'vue';
import RubyText from './common/RubyText.vue';
import { parseText, circleExplanations } from '../utils/typography';

type Word = {
  w: string;
  text: string;
  pron: string;
  expl: string[];
};

type Spring = {
  x: number;
  y: number;
  scale: number;
};

const words = ref<Word[]>([]);
const gone = ref(new Set<number>());
// 卡片的弹簧数据
const springs = reactive<Spring[]>([]);
// 存储当前拖动的卡片索引
const currentDraggingIndex = ref<number | null>(null);
// 存储拖动开始时的鼠标或触摸位置
const startX = ref(0);
// 存储拖动过程中的移动距离
const movementX = ref(0);
// 存储拖动开始的时间
const startTime = ref(0);

const cards = computed(() => {
  return words.value.map((word) => {
    return {
      ...word,
      expl: parseText(circleExplanations(word.expl)),
    };
  });
});

const fetchWords = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || '/'}/shuffle/`
    );

    if (!response.ok) {
      throw new Error('获取数据失败');
    }

    const responseData = await response.json();

    if (responseData.status == 200 && responseData.data.randomWords) {
      words.value = responseData.data.randomWords;

      setTimeout(() => {
        initSprings();
      }, 0);
    } else {
      throw new Error('数据格式不正确');
    }
  } catch (err) {
    console.error('获取词汇数据失败:', err);
  }
};

const initSprings = (): void => {
  // 清空现有弹簧数据
  springs.length = 0;

  // 为新卡片创建弹簧数据
  cards.value.forEach((_, i) => {
    // 初始位置设置在屏幕外，为入场动画做准备
    springs.push({
      x: i * 4,
      y: i * 4,
      scale: 1,
    });
  });

  // 异步执行入场动画，确保DOM已更新
  setTimeout(() => {
    cards.value.forEach((_, i) => {
      gsap.to(springs[i], {
        x: i * 4,
        y: i * 4,
        scale: 1,
        duration: 0.6,
        delay: i * 0.05,
        ease: 'power2.out',
      });
    });
  }, 0);

  gone.value.clear();
};

// 拖动开始事件处理函数
const onDragStart = (index: number): void => {
  currentDraggingIndex.value = index;
  const event = window.event as MouseEvent | TouchEvent;
  startX.value =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  movementX.value = 0;
  startTime.value = Date.now();
  // 拖动时卡片放大
  gsap.to(springs[index], { scale: 1.1, duration: 0.1 });
};

// 拖动移动事件处理函数
const onDragMove = (index: number, event: MouseEvent | TouchEvent): void => {
  if (currentDraggingIndex.value === index) {
    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    movementX.value = clientX - startX.value;
    // 更新卡片的 x 位置和旋转角度
    springs[index].x = movementX.value;
  }
};

// 拖动结束事件处理函数
const onDragEnd = (index: number): void => {
  if (currentDraggingIndex.value === index) {
    const endTime = Date.now();
    const elapsedTime = endTime - startTime.value;
    const velocity = Math.abs(movementX.value) / elapsedTime;
    const trigger = velocity > 0.002; // 调整触发速度阈值
    const dir = movementX.value < 0 ? -1 : 1;

    if (trigger) {
      gone.value.add(index);
      // 卡片移除动画
      gsap.to(springs[index], {
        x: (window.innerWidth + 200) * dir,
        scale: 0.2,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (gone.value.size === cards.value.length) {
            setTimeout(() => {
              fetchWords();
            }, 0);
          }
        },
      });
    } else {
      // 卡片回到初始位置
      gsap.to(springs[index], {
        x: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    currentDraggingIndex.value = null;
  }
};

onMounted(() => {
  fetchWords();
});
</script>

<style scoped>
.deck > div {
  will-change: transform;
}
</style>
