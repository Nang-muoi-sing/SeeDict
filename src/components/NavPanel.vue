<template>
  <div class="flex h-full flex-row justify-between rounded-lg bg-white">
    <div
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <RouterLink :to="{ name: 'home' }">主页</RouterLink>
    </div>
    <div
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <RouterLink :to="{ name: 'tutorial' }">入门</RouterLink>
    </div>
    <div
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <a
        href="https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc"
        target="_blank"
        >帮助</a
      >
    </div>
    <div
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <RouterLink :to="{ name: 'about' }">关于</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
