/** Returns a number in [0, 1). */
export type Rng = () => number

/** Small seeded PRNG, so generated art looks the same on every load. */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Combines several integers into one seed. */
export function hashSeed(...parts: number[]): number {
  let hash = 2166136261
  for (const part of parts) {
    hash = Math.imul(hash ^ (part | 0), 16777619)
    hash ^= hash >>> 15
  }
  return hash >>> 0
}
