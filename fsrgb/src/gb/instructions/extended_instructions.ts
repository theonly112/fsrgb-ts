import { type InstructionContext } from './instruction_context'
import { B, C, CpuFlags, D, E } from '../registers'
import { carryFlag, zeroFlag } from './flags'

export const ExtendedInstructions = new Map<number, (context: InstructionContext) => void>([
  [0x19, (c) => { rr(c, C) }],
  [0x1A, (c) => { rr(c, D) }],
  [0x1B, (c) => { rr(c, E) }],
  [0x38, (c) => { slr(c, B) }]
])

function slr (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  carryFlag(c, (value & 0x01) !== 0)
  value = value >> 1
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rr (c: InstructionContext, reg: string): void {
  const prevC = c.regs.check(CpuFlags.Carry)
  let value = c.regs.get(reg)
  carryFlag(c, (value & 0x01) > 0)
  value = value >> 1
  if (prevC) {
    value |= 0x80
  }
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}
