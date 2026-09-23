import type { Palette } from './palette'
import type { Rng } from './rng'

/** A cloud silhouette on the art-pixel grid, row-major: 1 = cloud, 0 = empty. */
export interface CloudShape {
  width: number
  height: number
  cells: Uint8Array
}

interface Circle {
  cx: number
  cy: number
  r: number
}

function inCircle(px: number, py: number, { cx, cy, r }: Circle): boolean {
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r
}

/**
 * Builds a cloud that fills a width × height box: a flat base with rounded ends
 * and a row of round puffs on top.
 */
export function makeCloudShape(width: number, height: number, rng: Rng): CloudShape {
  const cells = new Uint8Array(width * height)

  const baseHeight = Math.max(2, Math.round(height * 0.55))
  const baseRadius = baseHeight / 2
  const baseEnds: Circle[] = [
    { cx: baseRadius, cy: height - baseRadius, r: baseRadius },
    { cx: width - baseRadius, cy: height - baseRadius, r: baseRadius },
  ]

  const puffs: Circle[] = []
  const puffCount = Math.max(1, Math.round(width / height))
  const tallest = Math.floor(puffCount / 2)
  for (let i = 0; i < puffCount; i++) {
    // The middle puff reaches the top, so the cloud uses the full height.
    const r = height * (i === tallest ? 0.5 : 0.3 + rng() * 0.18)
    const slot = (width * (i + 0.5)) / puffCount
    const cx = Math.min(width - r, Math.max(r, slot + (rng() - 0.5) * r))
    const cy = Math.max(r, height - baseHeight * 0.5 - r * 0.6)
    puffs.push({ cx, cy, r })
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Test the center of each pixel.
      const px = x + 0.5
      const py = y + 0.5
      const inBase =
        py >= height - baseHeight &&
        ((px >= baseRadius && px <= width - baseRadius) ||
          baseEnds.some((end) => inCircle(px, py, end)))
      if (inBase || puffs.some((puff) => inCircle(px, py, puff))) {
        cells[y * width + x] = 1
      }
    }
  }

  // Close one-pixel-wide notches between puffs; they read as noise rather than shape.
  for (let y = 0; y < height; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      if (cells[i - 1] === 1 && cells[i + 1] === 1) cells[i] = 1
    }
  }

  return { width, height, cells }
}

/** Paints a cloud with its top-left corner at (x, y): white body, light gray underside. */
export function paintCloud(
  ctx: CanvasRenderingContext2D,
  shape: CloudShape,
  x: number,
  y: number,
  palette: Palette,
): void {
  const { width, height, cells } = shape
  const shadeDepth = Math.max(1, Math.round(height / 6))
  const filled = (col: number, row: number) => row < height && cells[row * width + col] === 1
  const colorAt = (col: number, row: number) => {
    if (!filled(col, row)) return undefined
    return filled(col, row + shadeDepth) ? palette.cloud : palette.cloudShade
  }

  // Paint horizontal runs of the same color instead of single pixels.
  for (let row = 0; row < height; row++) {
    let runStart = 0
    let runColor = colorAt(0, row)
    for (let col = 1; col <= width; col++) {
      const color = col < width ? colorAt(col, row) : undefined
      if (color === runColor) continue
      if (runColor) {
        ctx.fillStyle = runColor
        ctx.fillRect(x + runStart, y + row, col - runStart, 1)
      }
      runStart = col
      runColor = color
    }
  }
}
