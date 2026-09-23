import { hashSeed, mulberry32 } from './rng'

/** A mountain range along the bottom edge. Sizes are in art pixels. */
export interface RangeConfig {
  seed: number
  /** One peak per cell of this width, so peaks keep their place when the window resizes. */
  cellWidth: number
  minHeight: number
  maxHeight: number
  /** Lowest height of the range, so valleys never reach the bottom edge. */
  base: number
  /** Height lost per column away from a peak. */
  slope: number
}

export interface Peak {
  x: number
  height: number
  /** Half the width of the flat top. */
  plateau: number
}

export function makePeaks(range: RangeConfig, cols: number): Peak[] {
  const peaks: Peak[] = []
  // Start one cell to the left, so a peak just off-screen still shapes the left edge.
  for (let cell = -1; cell * range.cellWidth < cols + range.cellWidth; cell++) {
    const rng = mulberry32(hashSeed(range.seed, cell))
    peaks.push({
      x: cell * range.cellWidth + Math.floor(rng() * range.cellWidth),
      height: range.minHeight + Math.floor(rng() * (range.maxHeight - range.minHeight + 1)),
      plateau: Math.floor(rng() * 2),
    })
  }
  return peaks
}

/** The height of the range in each column. */
export function rangeHeights(peaks: Peak[], range: RangeConfig, cols: number): number[] {
  return Array.from({ length: cols }, (_, x) => {
    let height = range.base
    for (const peak of peaks) {
      const distance = Math.max(0, Math.abs(x - peak.x) - peak.plateau)
      height = Math.max(height, peak.height - distance * range.slope)
    }
    return Math.floor(height)
  })
}

export function paintRange(
  ctx: CanvasRenderingContext2D,
  heights: number[],
  rows: number,
  color: string,
): void {
  ctx.fillStyle = color
  heights.forEach((height, x) => ctx.fillRect(x, rows - height, 1, height))
}
