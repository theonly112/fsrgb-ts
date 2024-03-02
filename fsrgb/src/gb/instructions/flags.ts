import { CpuFlags } from '../registers'
import { type InstructionContext } from './instruction_context'

export function halfCarryFlag (c: InstructionContext, arg0: boolean): void {
  if (arg0) {
    c.regs.set_flag(CpuFlags.HalfCarry)
  } else {
    c.regs.clear_flag(CpuFlags.HalfCarry)
  }
}

export function carryFlag (c: InstructionContext, arg0: boolean): void {
  if (arg0) {
    c.regs.set_flag(CpuFlags.Carry)
  } else {
    c.regs.clear_flag(CpuFlags.Carry)
  }
}

export function zeroFlag (c: InstructionContext, v: number): void {
  if (v > 0) {
    c.regs.clear_flag(CpuFlags.Zero)
  } else {
    c.regs.set_flag(CpuFlags.Zero)
  }
}

export function zeroFlagBool (c: InstructionContext, arg: boolean): void {
  if (arg) {
    c.regs.set_flag(CpuFlags.Zero)
  } else {
    c.regs.clear_flag(CpuFlags.Zero)
  }
}
