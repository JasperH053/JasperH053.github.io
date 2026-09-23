/**
 * Paints a sprite written as rows of characters, with its top-left corner at (x, y).
 * Each character is looked up in `colors`; characters without a color are transparent.
 */
export function paintSprite(
  ctx: CanvasRenderingContext2D,
  sprite: readonly string[],
  colors: Record<string, string>,
  x: number,
  y: number,
): void {
  sprite.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const color = colors[row.charAt(dx)]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x + dx, y + dy, 1, 1)
    }
  })
}
