import { readFileSync } from 'node:fs'
import { PlainCartridge } from './gb/cartridge'
import { Cpu } from './gb/cpu'
import { Registers } from './gb/registers'

const buff: Uint8Array = readFileSync('test-cartridges\\cpu_instrs\\individual\\06-ld r,r.gb')
const cart = new PlainCartridge(buff)
const registers = new Registers()

const c: Cpu = new Cpu(registers, cart)
for (let index = 0; index < 10; index++) {
  c.step()
}

// Keep process alive for automatic rebuild on save.
setInterval(() => { }, 1 << 30)
