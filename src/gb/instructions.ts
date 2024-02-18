import { type Cartridge } from './cartridge'
import { PC, type Registers } from './registers'

export interface InstructionContext {
  regs: Registers
  cart: Cartridge
}

export const Instructions = new Map<number, (context: InstructionContext) => void>([
  [0x00, () => { console.log('NOP') }],
  [0xC3, (c) => { c.regs.set(PC, c.cart.read_word(c.regs.get(PC))) }]
])
