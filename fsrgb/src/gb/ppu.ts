/* eslint-disable @typescript-eslint/naming-convention */
import { type Color, type Display, type Framebuffer } from './display/display'
import { int8, testBit } from './helpers'
import { InterruptFlags } from './interrupt_flags'
import { type Logger } from './logger'
import { type MemoryManagementUnit } from './mmu'

export class PixelProcessingUnit {
  private mode: Mode = Mode.HBlank
  private ticks: number = 0

  private readonly scanLineAddress: number = 0xFF44
  private readonly lcdcAddress: number = 0xFF40
  private readonly interruptFlagsAddr: number = 0xFF0F
  private readonly fb: Framebuffer
  backgroundPalette: Color[]

  constructor (private readonly mmu: MemoryManagementUnit,
    private readonly display: Display,
    private readonly logger: Logger) {
    this.fb = display.createFramebuffer()
    this.backgroundPalette = [{ r: 255, g: 255, b: 255 }, { r: 192, g: 192, b: 192 }, { r: 96, g: 96, b: 96 }, { r: 0, g: 0, b: 0 }]
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

  drawScanline (): void {
    const ly = this.mmu.read(this.scanLineAddress)
    const lcdc = this.mmu.read(this.lcdcAddress)

    if ((lcdc & 1) === 1) {
      this.drawBackground(ly, lcdc)
    }
  }

  drawBackground (ly: number, lcdc: number): void {
    const scx = this.mmu.read(0xFF43)
    const scy = this.mmu.read(0xFF42)

    const tiles = testBit(lcdc, 4) ? 0x8000 : 0x8800
    const map = testBit(lcdc, 3) ? 0x9C00 : 0x9800
    const colorPallete = this.mmu.read(0xFF47)

    const lineScrolled = ((ly + scy) & 0xff)
    const y_32 = Math.trunc(lineScrolled / 8) * 32
    const pixely = lineScrolled % 8
    const pixely_2 = pixely * 2

    for (let x = 0; x < 32; x++) {
      let tile = 0
      if (tiles === 0x8800) {
        tile = int8(this.mmu.read((map + y_32 + x) & 0xffff))
        tile += 128
      } else {
        tile = this.mmu.read((map + y_32 + x) & 0xffff)
      }

      const mapOffsetX = x * 8
      const tile_16 = tile * 16
      const tile_address = tiles + tile_16 + pixely_2

      const byte1 = this.mmu.read(tile_address & 0xffff)
      const byte2 = this.mmu.read((tile_address + 1) & 0xffff)

      for (let pixelx = 0; pixelx < 8; pixelx++) {
        const bufferX = mapOffsetX + pixelx - scx
        if (bufferX < 0) { continue }

        if (bufferX >= 160) { continue }

        const pixelx_pos = pixelx

        let pixel = (byte1 & 0x1 << 7 - pixelx_pos) !== 0 ? 1 : 0
        pixel |= (byte2 & 0x1 << 7 - pixelx_pos) !== 0 ? 2 : 0

        const color = (colorPallete >> pixel * 2 & 0x03) & 0xff

        this.fb.setPixel(bufferX, ly, this.backgroundPalette[color])
      }
    }
  }

  vram (): void {
    if (this.ticks >= 172) {
      this.mode = Mode.HBlank
      this.drawScanline()
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
        this.display.draw(this.fb)
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
