export interface Palette {
  sky: string
  cloud: string
  cloudShade: string
  sun: string
  mountainFar: string
  mountain: string
  hair: string
  skin: string
  shirt: string
  text: string
}

/** Reads the canvas colors from the CSS variables in src/assets/styles.css. */
export function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement)
  const read = (name: string) => style.getPropertyValue(name).trim()
  return {
    sky: read('--sky'),
    cloud: read('--cloud'),
    cloudShade: read('--cloud-shade'),
    sun: read('--sun'),
    mountainFar: read('--mountain-far'),
    mountain: read('--mountain'),
    hair: read('--hair'),
    skin: read('--skin'),
    shirt: read('--shirt'),
    text: read('--text'),
  }
}
