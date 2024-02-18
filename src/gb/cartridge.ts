export interface Cartridge {
  read: (addr: number) => number
  read_word: (addr: number) => number
  write: (addr: number, value: number) => void
}

export class PlainCartridge implements Cartridge {
  buff: Uint8Array
  constructor (buff: Uint8Array) {
    this.buff = buff
  }

  read (addr: number): number {
    return this.buff[addr]
  }

  read_word (addr: number): number {
    return (this.buff[addr + 1] << 8) | this.buff[addr]
  }

  write (addr: number, value: number): void {
    this.buff[addr] = value
  }
}
