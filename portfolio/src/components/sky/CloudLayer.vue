<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { usePixelCanvas } from '@/composables/usePixelCanvas'
import { makeCloudShape, paintCloud } from '@/pixel/cloud'
import { readPalette } from '@/pixel/palette'
import { hashSeed, mulberry32 } from '@/pixel/rng'

interface Depth {
  seed: number
  /** Drift speed in art pixels per second. */
  speed: number
  cellWidth: number
  cellHeight: number
  chance: number
  minWidth: number
  maxWidth: number
}

// Parallax: far clouds are smaller and drift slower than near ones. Far is drawn first.
// Clouds live in a fixed grid of cells (in art pixels), so resizing the window
// only reveals or hides clouds and never moves them.
const DEPTHS: Depth[] = [
  { seed: 2, speed: 0.7, cellWidth: 40, cellHeight: 26, chance: 0.45, minWidth: 8, maxWidth: 16 },
  { seed: 1, speed: 1, cellWidth: 64, cellHeight: 36, chance: 0.55, minWidth: 16, maxWidth: 40 },
]

/** How far each depth has drifted, in whole art pixels, so clouds move in pixel steps. */
let offsets = DEPTHS.map(() => 0)

function drawClouds(ctx: CanvasRenderingContext2D, cols: number, rows: number) {
  ctx.clearRect(0, 0, cols, rows)
  const palette = readPalette()

  DEPTHS.forEach((depth, i) => {
    const offset = offsets[i] ?? 0
    const firstCell = Math.floor(offset / depth.cellWidth)
    for (let cellY = 0; cellY * depth.cellHeight < rows; cellY++) {
      for (let cellX = firstCell; cellX * depth.cellWidth < offset + cols; cellX++) {
        const rng = mulberry32(hashSeed(depth.seed, cellX, cellY))
        if (rng() > depth.chance) continue

        const width = depth.minWidth + Math.floor(rng() * (depth.maxWidth - depth.minWidth))
        const height = Math.max(4, Math.round(width * (0.3 + rng() * 0.15)))
        const x = cellX * depth.cellWidth + Math.floor(rng() * (depth.cellWidth - width)) - offset
        const y = cellY * depth.cellHeight + Math.floor(rng() * (depth.cellHeight - height))
        paintCloud(ctx, makeCloudShape(width, height, rng), x, y, palette)
      }
    }
  })
}

const { canvas, redraw } = usePixelCanvas({ draw: drawClouds })

let frame = 0

function tick(now: number) {
  const seconds = now / 1000
  const next = DEPTHS.map((depth) => Math.floor(seconds * depth.speed))
  // Only redraw when a depth has moved a whole pixel.
  if (next.some((offset, i) => offset !== offsets[i])) {
    offsets = next
    redraw()
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <canvas ref="canvas" class="cloud-layer" />
</template>

<style scoped>
.cloud-layer {
  position: absolute;
  top: 0;
  left: 0;
  image-rendering: pixelated;
}
</style>
