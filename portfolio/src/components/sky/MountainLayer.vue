<script setup lang="ts">
import { usePixelCanvas } from '@/composables/usePixelCanvas'
import { HIKER, HIKER_WIDTH, hikerColors } from '@/pixel/hiker'
import { makePeaks, paintRange, rangeHeights, type RangeConfig } from '@/pixel/mountains'
import { readPalette } from '@/pixel/palette'
import { paintSprite } from '@/pixel/sprite'

const FAR: RangeConfig = { seed: 3, cellWidth: 44, minHeight: 20, maxHeight: 34, base: 12, slope: 0.8 }
const NEAR: RangeConfig = { seed: 4, cellWidth: 34, minHeight: 8, maxHeight: 20, base: 5, slope: 1 }

// The hiker stands on the far peak closest to this fraction of the width. That peak is
// raised above NEAR.maxHeight, so the near range never hides the hiker.
const HIKER_POSITION = 0.72
const HIKER_PEAK_HEIGHT = 40

function drawMountains(ctx: CanvasRenderingContext2D, cols: number, rows: number) {
  ctx.clearRect(0, 0, cols, rows)
  const palette = readPalette()

  const farPeaks = makePeaks(FAR, cols)
  const target = cols * HIKER_POSITION
  const hikerPeak = farPeaks.reduce((best, peak) =>
    Math.abs(peak.x - target) < Math.abs(best.x - target) ? peak : best,
  )
  hikerPeak.height = HIKER_PEAK_HEIGHT
  // A flat top as wide as the hiker, so both feet stand on the ground.
  hikerPeak.plateau = Math.floor(HIKER_WIDTH / 2)

  paintRange(ctx, rangeHeights(farPeaks, FAR, cols), rows, palette.mountainFar)
  paintSprite(
    ctx,
    HIKER,
    hikerColors(palette),
    hikerPeak.x - Math.floor(HIKER_WIDTH / 2),
    rows - hikerPeak.height - HIKER.length,
  )
  paintRange(ctx, rangeHeights(makePeaks(NEAR, cols), NEAR, cols), rows, palette.mountain)
}

const { canvas } = usePixelCanvas({ draw: drawMountains })
</script>

<template>
  <canvas ref="canvas" class="mountain-layer" />
</template>

<style scoped>
.mountain-layer {
  position: absolute;
  top: 0;
  left: 0;
  image-rendering: pixelated;
}
</style>
