import type { Palette } from './palette'

/** A tiny person with brown hair and glasses. */
export const HIKER = [
  '.HHH.',
  'HHHHH',
  'HSSSH',
  'GLGLG',
  '.SSS.',
  '.TTT.',
  'TTTTT',
  'STTTS',
  '.PPP.',
  '.P.P.',
  '.P.P.',
] as const

export const HIKER_WIDTH = 5

export function hikerColors(palette: Palette): Record<string, string> {
  return {
    H: palette.hair,
    S: palette.skin,
    G: palette.text, // glasses frame
    L: palette.cloud, // glasses lens
    T: palette.shirt,
    P: palette.text,
  }
}
