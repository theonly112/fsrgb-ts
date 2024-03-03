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
    if (cycles > 9619990) {
      let inst = this.mmu.read(this.state.PC)
      if (inst === 0xCB) {
        inst = (inst << 8) + this.mmu.read(this.state.PC + 1)
      }
      this.logger.write(this.regs.to_string() + `Cycles: ${cycles} LY: ${toHex(this.mmu.read(0xFF44), 2)} INST: ${toHex(inst, 4)}`)
    }
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

  handleInterrupts (): void {
    const IE = this.mmu.read(0xFFFF)
    const IF = this.mmu.read(0xFF0F)
    for (let index = 0; index < 5; index++) {
      if ((((IE & IF) >> index) & 0x01) === 1) {
        this.executeInterrupt(index)
      }
    }
  }

  executeInterrupt (i: number): void {
    this.state.halted = false
    if (this.state.ime) {
      // push word
      this.state.SP -= 2
      this.mmu.write_word(this.state.SP, this.state.PC)

      this.state.PC = 0x40 + (8 * i)
      this.state.ime = false
      let flag = this.mmu.read(0xFF0F)
      flag &= ~(i << 1)
      this.mmu.write(0xFF0F, flag)
    }
  }
}
