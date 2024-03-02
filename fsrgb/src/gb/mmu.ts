import { type Cartridge } from './cartridge'

export interface Mmu {
  read: (addr: number) => number
  read_word: (addr: number) => number
  write: (addr: number, value: number) => void
  write_direct: (addr: number, value: number) => void
  write_word: (addr: number, value: number) => void
}

export class MemoryManagementUnit implements Mmu {
  vram: Uint8Array
  wram: Uint8Array
  oam: Uint8Array
  io: Uint8Array
  hram: Uint8Array

  constructor (private readonly cart: Cartridge) {
    this.wram = new Uint8Array(0x2000)
    this.vram = new Uint8Array(0x2000)
    this.oam = new Uint8Array(0x100)
    this.io = new Uint8Array(0x100)
    this.hram = new Uint8Array(0x80)
  }

  write_word (addr: number, value: number): void {
    this.write(addr, value & 0xff)
    this.write(addr + 1, ((value & 0xff00) >> 8))
  }

  read (addr: number): number {
    if (addr <= 0x7fff) {
      return this.cart.read(addr)
    } else if (addr >= 0x8000 && addr <= 0x9fff) {
      return this.vram[addr - 0x8000]
    } else if (addr >= 0xa000 && addr <= 0xbfff) {
      return this.cart.read(addr)
    } else if (addr >= 0xc000 && addr <= 0xDFFF) {
      return this.wram[addr - 0xc000]
    } else if (addr >= 0xE000 && addr <= 0xFDFF) {
      return this.wram[addr - 0xE000]
    } else if (addr >= 0xfe00 && addr <= 0xfeff) {
      return this.oam[addr - 0xfe00]
    } else if (addr >= 0xff00 && addr <= 0xff7f) {
      return this.io[addr - 0xff00]
    } else if (addr >= 0xff80 && addr <= 0xffff) {
      return this.hram[addr - 0xff80]
    } else {
      return NaN // or throw an error, depending on your logic
    }
  }

  read_word (addr: number): number {
    return (this.read(addr + 1) << 8) | this.read(addr)
  }

  write (addr: number, value: number): void {
    this.write_checked(addr, value, false)
  }

  write_direct (addr: number, value: number): void {
    this.write_checked(addr, value, true)
  }

  write_checked (addr: number, value: number, direct: boolean): void {
    if (addr <= 0x7fff) {
      // unexpected
    } else if (addr >= 0x8000 && addr <= 0x9fff) {
      this.vram[addr - 0x8000] = value
    } else if (addr >= 0xa000 && addr <= 0xbfff) {
      this.cart.write(addr, value)
    } else if (addr >= 0xc000 && addr <= 0xDFFF) {
      this.wram[addr - 0xc000] = value
    } else if (addr >= 0xE000 && addr <= 0xFDFF) {
      this.wram[addr - 0xE000] = value
    } else if (addr >= 0xfe00 && addr <= 0xfeff) {
      // handled below?
    } else if (addr >= 0xff00 && addr <= 0xff7f) {
      // io
      if (addr === 0xff0f) {
        value |= 0xE0 // why?
      } else if (addr === 0xff44) {
        value = direct ? value : 0 // why?
      }
      this.io[addr - 0xff00] = value
      if (addr === 0xFF02 && value === 0x81) {
        console.log(String.fromCharCode(this.io[1]))
      }
    } else if (addr >= 0xff80 && addr <= 0xffff) {
      this.hram[addr - 0xff80] = value
    } else {
      // unexpected
    }
  }
}
