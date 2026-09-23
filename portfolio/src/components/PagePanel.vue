<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  /** Route of the next page in the story. Without it, the panel has no "next" button. */
  next?: string
}>()
</script>

<template>
  <section class="panel">
    <slot />
    <div v-if="next" class="panel__footer">
      <RouterLink :to="next" class="next">Volgende</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.panel {
  --p: var(--pixel);
  max-width: 720px;
  margin: 0 auto;
  padding: calc(var(--p) * 6);
  background: var(--panel);
  border: var(--p) solid var(--panel-border);
  /* Cut one art pixel off each corner for a stepped pixel-art corner. */
  clip-path: polygon(
    0 var(--p),
    var(--p) var(--p),
    var(--p) 0,
    calc(100% - var(--p)) 0,
    calc(100% - var(--p)) var(--p),
    100% var(--p),
    100% calc(100% - var(--p)),
    calc(100% - var(--p)) calc(100% - var(--p)),
    calc(100% - var(--p)) 100%,
    var(--p) 100%,
    var(--p) calc(100% - var(--p)),
    0 calc(100% - var(--p))
  );
}

.panel__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: calc(var(--p) * 4);
}

/* A pixel-art PNG drawn at 1× (40 × 16), scaled up by --pixel. */
.next {
  display: inline-grid;
  place-items: center;
  width: calc(var(--p) * 40);
  height: calc(var(--p) * 16);
  /* Clouds are puffy on top, so the label sits a bit below center, on the cloud's body. */
  padding-top: calc(var(--p) * 3);
  background: url('@/assets/clouds/next.png') center / 100% 100% no-repeat;
  image-rendering: pixelated;
  color: var(--text);
  font-size: 22px;
  line-height: 1;
  text-decoration: none;
  transition: all 100ms;
}

.next:focus-visible {
  outline: var(--p) solid var(--text);
  outline-offset: var(--p);
}

.next:hover {
  width: calc(var(--p) * 45);
  height: calc(var(--p) * 18);
}

.panel :slotted(h1) {
  margin-top: 0;
  font-size: 32px;
  line-height: 1.2;
}
</style>
