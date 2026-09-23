<script setup lang="ts">
import { usePixelCanvas } from '@/composables/usePixelCanvas'
import { readPalette } from '@/pixel/palette'
import { paintSun } from '@/pixel/sun'

// The sun is anchored to the top-right corner (in art pixels).
const SUN_RADIUS = 6
const SUN_RIGHT = 20
const SUN_TOP = 26

function drawSky(ctx: CanvasRenderingContext2D, cols: number, rows: number) {
  const palette = readPalette()
  ctx.fillStyle = palette.sky
  ctx.fillRect(0, 0, cols, rows)
  paintSun(ctx, cols - SUN_RIGHT, SUN_TOP, SUN_RADIUS, palette.sun)
}

const { canvas } = usePixelCanvas({ draw: drawSky })
</script>

<template>
  <canvas ref="canvas" class="sky-layer" />
</template>

<style scoped>
.sky-layer {
  position: absolute;
  top: 0;
  left: 0;
  image-rendering: pixelated;
}
</style>
