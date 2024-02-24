import { InterruptFlags } from './interrupt_flags'
import { type MemoryManagementUnit } from './mmu'

export class PixelProcessingUnit {
  private mode: Mode = Mode.HBlank
  private ticks: number = 0

  private readonly scanLineAddress: number = 0xFF44
  private readonly interruptFlagsAddr: number = 0xFF0F

  constructor (private readonly mmu: MemoryManagementUnit) {

  }

  step (cycles: number): void {
    this.ticks += cycles
    switch (this.mode) {
      case Mode.HBlank:
        this.hBlank()
        break
      case Mode.VBlank:
        this.vBlank()
        break
      case Mode.Oam:
        this.oam()
        break
      case Mode.Vram:
        this.vram()
        break
    }
  }

  vram (): void {
    if (this.ticks >= 172) {
      this.mode = Mode.HBlank
      // TODO draw scanline
      this.ticks -= 172
    }
  }

  hBlank (): void {
    if (this.ticks >= 204) {
      let scanline = this.mmu.read(this.scanLineAddress)
      scanline = (scanline + 1) & 0xff
      this.mmu.write_direct(this.scanLineAddress, scanline)
      if (scanline === 144) {
        const interruptFlag = this.mmu.read(this.interruptFlagsAddr)
        this.mmu.write_direct(this.interruptFlagsAddr, interruptFlag | InterruptFlags.VBlank)
        // TODO: draw display
        this.mode = Mode.VBlank
      } else {
        this.mode = Mode.Oam
      }
      this.ticks -= 204
    }
  }

  vBlank (): void {
    if (this.ticks >= 456) {
      let scanline = this.mmu.read(this.scanLineAddress)
      scanline = (scanline + 1) & 0xff
      this.mmu.write_direct(this.scanLineAddress, scanline)

      if (scanline > 153) {
        this.mmu.write_direct(this.scanLineAddress, 0)
        this.mode = Mode.Oam
      }

      this.ticks -= 456
    }
  }

  oam (): void {
    if (this.ticks >= 80) {
      this.mode = Mode.Vram
      // TODO draw scanline
      this.ticks -= 80
    }
  }
}

enum Mode {
  HBlank,
  VBlank,
  Oam,
  Vram
}
