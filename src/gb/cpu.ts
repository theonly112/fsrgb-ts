import { type Cartridge } from './cartridge'
import { InitialState } from './initial-state'
import { Instructions, type InstructionContext } from './instructions'
import { AF, BC, DE, HL, PC, SP, type Registers } from './registers'

export class Cpu {
  state: InstructionContext
  constructor (private readonly regs: Registers, private readonly cart: Cartridge) {
    this.initialize()
    this.state = { regs, cart }
  }

  initialize (): void {
    this.regs.set(AF, InitialState.AF)
    this.regs.set(BC, InitialState.AF)
    this.regs.set(DE, InitialState.DE)
    this.regs.set(HL, InitialState.AF)
    this.regs.set(SP, InitialState.SP)
    this.regs.set(PC, InitialState.PC)
  }

  step (): void {
    const pc = this.regs.get(PC)
    const num = this.cart.read(pc)
    const inst = Instructions.get(num)
    this.regs.set(PC, pc + 1)
    if (inst !== undefined) {
      inst(this.state)
    } else {
      console.log('Not implemented instruction: ' + num.toString(16))
    }
  }
}
