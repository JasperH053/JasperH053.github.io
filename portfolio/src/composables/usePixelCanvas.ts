import { onBeforeUnmount, onMounted, ref } from 'vue'
import { PIXEL } from '@/pixel/constants'

export interface PixelCanvasOptions {
  /** Draws the whole layer. Called whenever the grid size changes. */
  draw: (ctx: CanvasRenderingContext2D, cols: number, rows: number) => void
  /** Keep existing pixels (anchored top-left) on resize, e.g. for a drawing layer. */
  preserve?: boolean
}

/**
 * A canvas where one canvas pixel is one art pixel, scaled up by CSS to PIXEL
 * CSS pixels. The grid covers the canvas's parent element and follows its size.
 */
export function usePixelCanvas({ draw, preserve = false }: PixelCanvasOptions) {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const cols = ref(0)
  const rows = ref(0)
  let observer: ResizeObserver | undefined

  function resize(width: number, height: number) {
    const el = canvas.value
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return

    const nextCols = Math.ceil(width / PIXEL)
    const nextRows = Math.ceil(height / PIXEL)
    if (nextCols === cols.value && nextRows === rows.value) return

    let previous: HTMLCanvasElement | undefined
    if (preserve && el.width > 0 && el.height > 0) {
      previous = document.createElement('canvas')
      previous.width = el.width
      previous.height = el.height
      previous.getContext('2d')?.drawImage(el, 0, 0)
    }

    // Setting the size clears the canvas and resets the context state.
    el.width = nextCols
    el.height = nextRows
    el.style.width = `${nextCols * PIXEL}px`
    el.style.height = `${nextRows * PIXEL}px`
    ctx.imageSmoothingEnabled = false
    cols.value = nextCols
    rows.value = nextRows

    draw(ctx, nextCols, nextRows)
    if (previous) ctx.drawImage(previous, 0, 0)
  }

  function redraw() {
    const ctx = canvas.value?.getContext('2d')
    if (ctx) draw(ctx, cols.value, rows.value)
  }

  /** Converts a pointer position to art-pixel coordinates on this canvas. */
  function toGrid(event: { clientX: number; clientY: number }) {
    const rect = canvas.value?.getBoundingClientRect()
    if (!rect) return undefined
    return {
      x: Math.floor((event.clientX - rect.left) / PIXEL),
      y: Math.floor((event.clientY - rect.top) / PIXEL),
    }
  }

  onMounted(() => {
    const host = canvas.value?.parentElement
    if (!host) return
    observer = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect()
      resize(width, height)
    })
    observer.observe(host)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { canvas, cols, rows, redraw, toGrid }
}
