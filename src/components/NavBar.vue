<template>
  <div>
    <nav
      class="flex flex-row items-center justify-between gap-5 px-4 py-2 sm:px-16 sm:py-8"
    >
      <RouterLink :to="{ name: 'home' }" class="z-100 hidden min-w-35 md:block">
        <img src="../assets/logo.svg" />
      </RouterLink>
      <SearchBar
        v-if="props.showSearchBar"
        class="w-xs sm:w-sm md:w-md"
      ></SearchBar>
      <NavPanel class="z-100 hidden w-xs lg:flex"></NavPanel>
      <button
        class="text-rosybrown-600 hover:text-rosybrown-800 flex cursor-pointer items-center rounded-md p-2 focus:outline-none lg:hidden"
        @click="isSidebarOpen = true"
      >
        <i-material-symbols-menu-rounded style="font-size: 36px" />
      </button>
    </nav>

    <div
      class="fixed inset-0 z-500 flex lg:hidden"
      :class="{ hidden: !isSidebarOpen }"
    >
      <div
        class="fixed inset-0 backdrop-blur-xs backdrop-brightness-90 transition-all duration-500 ease-in-out"
        @click="isSidebarOpen = false"
      ></div>

      <div
        class="bg-wheat-50 absolute top-0 right-0 h-full w-full max-w-xs transform flex-col transition-transform duration-300 ease-in-out"
        :class="{
          'translate-x-full': !isSidebarOpen,
          'translate-x-0': isSidebarOpen,
        }"
      >
        <button
          class="text-rosybrown-600 hover:text-rosybrown-800 flex cursor-pointer items-center rounded-md p-2 focus:outline-none lg:hidden"
          @click="isSidebarOpen = false"
        >
          <i-material-symbols-menu-rounded style="font-size: 36px" />
        </button>

        <div
          class="flex w-full flex-col items-center justify-center px-2 py-4 font-sans text-lg"
        >
          <img class="mb-8" src="../assets/logo.svg" draggable="false" />
          <div
            class="hover:bg-wheat-100 text-rosybrown-600 hover:text-rosybrown-800 m-1 w-full content-center rounded-xs px-3 py-1.5 align-middle font-bold transition-all ease-in-out"
          >
            <RouterLink
              :to="{ name: 'home' }"
              class="inline-flex w-full items-center"
              ><i-material-symbols-home-rounded class="mr-1" />主页</RouterLink
            >
          </div>
          <div
            class="hover:bg-wheat-100 text-rosybrown-600 hover:text-rosybrown-800 m-1 w-full content-center rounded-xs px-3 py-1.5 align-middle font-bold transition-all ease-in-out"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'tutorial' }"
            >
              <i-material-symbols-school-rounded class="mr-1" />入门</RouterLink
            >
          </div>
          <div
            class="hover:bg-wheat-100 text-rosybrown-600 hover:text-rosybrown-800 m-1 w-full content-center rounded-xs px-3 py-1.5 align-middle font-bold transition-all ease-in-out"
          >
            <a
              class="inline-flex w-full items-center"
              href="https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc"
              target="_blank"
              ><i-material-symbols-help-rounded class="mr-1" />帮助</a
            >
          </div>
          <div
            class="hover:bg-wheat-100 text-rosybrown-600 hover:text-rosybrown-800 m-1 w-full content-center rounded-xs px-3 py-1.5 align-middle font-bold transition-all ease-in-out"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'about' }"
            >
              <i-material-symbols-crowdsource class="mr-1" />关于</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from './SearchBar.vue';
import NavPanel from './NavPanel.vue';
import { ref } from 'vue';

interface Props {
  showSearchBar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
});

// 控制侧边栏显示状态
const isSidebarOpen = ref(false);
</script>

<style scoped>
/* 侧边栏动画过渡效果 */
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}
</style>
