import { readFileSync } from 'node:fs'
import { PlainCartridge } from './gb/cartridge'
import { Cpu } from './gb/cpu'
import { Registers } from './gb/registers'
import { MemoryManagementUnit } from './gb/mmu'
import { FileLogger } from './gb/logger'
import { PixelProcessingUnit } from './gb/ppu'
import { PngDisplay } from './gb/display/png_display'
import { Timer } from './gb/timer'

const logger = new FileLogger()
const buff: Uint8Array = readFileSync('test-cartridges/cpu_instrs/individual/10-bit ops.gb')
const buff: Uint8Array = readFileSync('test-cartridges/cpu_instrs/individual/01-special.gb')
const cart = new PlainCartridge(buff)
const registers = new Registers()
const mmu = new MemoryManagementUnit(cart)
const timer = new Timer(mmu)
const display = new PngDisplay()

const ppu = new PixelProcessingUnit(mmu, display, logger)
const c: Cpu = new Cpu(registers, mmu, logger)
const start = new Date().getTime()

try {
  for (let index = 0; index < 1024 * 64 * 128; index++) {
    // if (c.state.cycles === 12517986) {
    //   console.log('break')
    // }
    const cycles = c.step()
    timer.step(cycles)
    ppu.step(cycles)
    c.handleInterrupts()

    if (mmu.read(registers.get('PC')) === 0x18 &&
      mmu.read((registers.get('PC') + 1)) === 0xFE) {
      // console.log('Detected endless loop. Exiting')
      // break
    }
  }
} catch (error) {
  console.log(error)
}

const end = new Date().getTime()
console.log(`Took ${(end - start)}ms`)
logger.close()

console.log(`Executed ${c.state.cycles} cycles.`)

// Keep process alive for automatic rebuild on save.
setInterval(() => { }, 1 << 30)
