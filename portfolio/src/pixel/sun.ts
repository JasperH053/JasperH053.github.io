const RAY_DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const

/** Paints a round sun centered on pixel (cx, cy), with short rays in eight directions. */
export function paintSun(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
): void {
  ctx.fillStyle = color
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      // `+ radius` rounds the outline, so the disc has no single-pixel points at the edges.
      if (dx * dx + dy * dy <= radius * radius + radius) ctx.fillRect(cx + dx, cy + dy, 1, 1)
    }
  }

  for (const [dx, dy] of RAY_DIRECTIONS) {
    const diagonal = dx !== 0 && dy !== 0
    const start = diagonal ? Math.round((radius + 2) * Math.SQRT1_2) : radius + 2
    for (let d = start; d < start + 2; d++) ctx.fillRect(cx + dx * d, cy + dy * d, 1, 1)
  }
}
