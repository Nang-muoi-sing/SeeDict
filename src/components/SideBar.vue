<template>
  <aside class="fixed z-10 w-52 rounded-lg bg-white p-5">
    <ol class="space-y-1">
      <li v-for="(heading, index) in headings" :key="index">
        <a
          :href="`#${heading.id}`"
          class="text-rosybrown-600 hover:text-rosybrown-800 relative block pl-5 font-semibold text-nowrap transition-all duration-300"
          :class="{ 'text-rosybrown-800 font-bold': activeId === heading.id }"
        >
          <div class="flex items-center gap-1">
            <span
              class="absolute left-0 transform transition-all duration-300"
              :class="{
                'scale-125 opacity-100': activeId === heading.id,
                'scale-100 opacity-60': activeId !== heading.id,
              }"
            >
              <i-material-symbols-circle v-if="activeId === heading.id" />
              <i-material-symbols-circle-outline v-else />
            </span>
            <span>&ensp;{{ heading.text }}</span>
          </div>
        </a>
      </li>
    </ol>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const headings = ref<Array<{ id: string; text: string }>>([]);
const activeId = ref('');

// 收集h2标题
const collectHeadings = () => {
  const h2Elements = document.querySelectorAll('h2[id]');
  headings.value = Array.from(h2Elements).map((el) => ({
    id: el.id,
    text:
      el.textContent?.trim() || `标题${Array.from(h2Elements).indexOf(el) + 1}`,
  }));
  checkActiveHeading();
};

// 检查当前激活标题
const checkActiveHeading = () => {
  const scrollPosition = window.scrollY + 100;
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i];
    const element = document.getElementById(heading.id);
    if (!element) continue;
    if (scrollPosition >= element.offsetTop) {
      activeId.value = heading.id;
      return;
    }
  }
  if (headings.value.length > 0) {
    activeId.value = headings.value[0].id;
  }
};

onMounted(() => {
  collectHeadings();
  window.addEventListener('scroll', checkActiveHeading);

  const observer = new MutationObserver(collectHeadings);
  observer.observe(document.body, { childList: true, subtree: true });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkActiveHeading);
    observer.disconnect();
  });
});
</script>