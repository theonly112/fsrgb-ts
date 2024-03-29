export function toHex (num: number, len: number): string {
  const str = num.toString(16).toUpperCase()
  return '0'.repeat(len - str.length) + str
}

export function int8 (v: number): number {
  const ref = v & 0xff
  return (ref > 0x7F) ? ref - 0x100 : ref
}

export function uint8 (v: number): number {
  return v & 0xff
}

export function testBit (v: number, bit: number): boolean {
  return (v & (1 << bit)) !== 0
}
