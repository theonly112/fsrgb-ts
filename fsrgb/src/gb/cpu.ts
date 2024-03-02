import { State } from './instructions/state'
import { toHex } from './helpers'
import { InitialState } from './initial-state'
import { InstructionTicks } from './instructions/instruction_ticks'
import { Instructions } from './instructions/instructions'
import { type InstructionContext } from './instructions/instruction_context'
import { type Logger } from './logger'
import { type Mmu } from './mmu'
import { AF, BC, DE, HL, PC, SP, type Registers } from './registers'

export class Cpu {
  state: InstructionContext
  constructor (private readonly regs: Registers,
    private readonly mmu: Mmu,
    private readonly logger: Logger) {
    this.setup()
    this.state = new State(false, regs, mmu, 0)
  }

  private setup (): void {
    this.regs.set(AF, InitialState.AF)
    this.regs.set(BC, InitialState.BC)
    this.regs.set(DE, InitialState.DE)
    this.regs.set(HL, InitialState.HL)
    this.regs.set(SP, InitialState.SP)
    this.regs.set(PC, InitialState.PC)
  }

  step (): number {
    const cycles = this.state.cycles
    this.logger.write(this.regs.to_string() + `Cycles: ${cycles} LY: ${toHex(this.mmu.read(0xFF44), 2)}`)
    const pc = this.regs.get(PC)
    const num = this.mmu.read(pc)
    const inst = Instructions.get(num)
    this.regs.set(PC, pc + 1)
    if (inst !== undefined) {
      inst(this.state)
      this.state.cycles += InstructionTicks[num]
    } else {
      throw new Error(`not implemented instruction ${num.toString(16)}`)
    }
    return this.state.cycles - cycles
  }
}
