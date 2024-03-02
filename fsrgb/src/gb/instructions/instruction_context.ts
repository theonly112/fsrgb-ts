import { type Mmu } from '../mmu'
import { type Registers } from '../registers'

export interface InstructionContext {
  ime: boolean
  regs: Registers
  mmu: Mmu
  cycles: number
  AF: number
  A: number
  F: number
  BC: number
  B: number
  C: number
  DE: number
  D: number
  E: number
  HL: number
  H: number
  L: number
  SP: number
  PC: number
}
