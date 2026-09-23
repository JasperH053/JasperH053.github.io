<script setup lang="ts">
import CloudLayer from './CloudLayer.vue'
import MountainLayer from './MountainLayer.vue'
import SkyLayer from './SkyLayer.vue'
</script>

<template>
  <!-- Stack of full-screen canvas layers behind the page, back to front. -->
  <div class="sky" aria-hidden="true">
    <!-- The scene is dimmed so the page content stands out. A drawing layer goes after it, undimmed. -->
    <div class="sky__scene">
      <SkyLayer />
      <CloudLayer />
      <MountainLayer />
    </div>
  </div>
</template>

<style scoped>
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.sky__scene {
  position: absolute;
  inset: 0;
  opacity: var(--backdrop-opacity);
}
</style>
