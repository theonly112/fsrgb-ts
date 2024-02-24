import { readFileSync } from 'node:fs'
import { PlainCartridge } from './gb/cartridge'
import { Cpu } from './gb/cpu'
import { Registers } from './gb/registers'
import { MemoryManagementUnit } from './gb/mmu'
import { FileLogger } from './gb/logger'
import { PixelProcessingUnit } from './gb/ppu'
import { PngDisplay } from './gb/display/png_display'

const logger = new FileLogger()
const buff: Uint8Array = readFileSync('test-cartridges/cpu_instrs/individual/06-ld r,r.gb')
const cart = new PlainCartridge(buff)
const registers = new Registers()
const mmu = new MemoryManagementUnit(cart)

const display = new PngDisplay()

const ppu = new PixelProcessingUnit(mmu, display, logger)
const c: Cpu = new Cpu(registers, mmu, logger)

const start = new Date().getTime()
for (let index = 0; index < 1024 * 64 * 8; index++) {
  const cycles = c.step()
  ppu.step(cycles)

  if (mmu.read(registers.get('PC')) === 0x18 &&
      mmu.read((registers.get('PC') + 1)) === 0xFE) {
    // console.log('Detected endless loop. Exiting')
    // break
  }
}

const end = new Date().getTime()
console.log(`Took ${(end - start)}ms`)
logger.close()

console.log(`Executed ${c.state.cycles} cycles.`)

// Keep process alive for automatic rebuild on save.
setInterval(() => { }, 1 << 30)
