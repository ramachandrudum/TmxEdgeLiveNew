export function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function varySeed(...parts: (string | number)[]): () => number {
  return seededRandom(hashSeed(parts.join('|')))
}

export function intBetween(rnd: () => number, min: number, max: number): number {
  return Math.floor(min + rnd() * (max - min + 1))
}

export function numBetween(rnd: () => number, min: number, max: number, dps = 1): number {
  const v = min + rnd() * (max - min)
  return Number(v.toFixed(dps))
}