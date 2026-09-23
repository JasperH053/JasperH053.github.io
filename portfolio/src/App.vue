<script setup lang="ts">
import { RouterView } from 'vue-router'
import SkyBackground from '@/components/sky/SkyBackground.vue'
import NavBar from '@/components/nav/NavBar.vue'
</script>

<template>
  <SkyBackground />
  <div class="page">
    <NavBar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.content {
  padding: 0 16px calc(var(--pixel) * 12);
}
</style>
