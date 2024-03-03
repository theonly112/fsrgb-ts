import { type InstructionContext } from './instruction_context'
import { A, B, C, CpuFlags, D, E, H, L } from '../registers'
import { carryFlag, zeroFlag } from './flags'
import { uint8 } from '../helpers'

export const ExtendedInstructions = new Map<number, (context: InstructionContext) => void>([
  [0x00, (c) => { rlc(c, B) }],
  [0x01, (c) => { rlc(c, C) }],
  [0x02, (c) => { rlc(c, D) }],
  [0x03, (c) => { rlc(c, E) }],
  [0x04, (c) => { rlc(c, H) }],
  [0x05, (c) => { rlc(c, L) }],
  [0x07, (c) => { rlc(c, A) }],
  [0x08, (c) => { rrc(c, B) }],
  [0x09, (c) => { rrc(c, C) }],
  [0x0A, (c) => { rrc(c, D) }],
  [0x0B, (c) => { rrc(c, E) }],
  [0x0C, (c) => { rrc(c, H) }],
  [0x0D, (c) => { rrc(c, L) }],
  [0x0F, (c) => { rrc(c, A) }],
  [0x10, (c) => { rl(c, B) }],
  [0x11, (c) => { rl(c, C) }],
  [0x12, (c) => { rl(c, D) }],
  [0x13, (c) => { rl(c, E) }],
  [0x14, (c) => { rl(c, H) }],
  [0x15, (c) => { rl(c, L) }],
  [0x17, (c) => { rl(c, A) }],
  [0x18, (c) => { rr(c, B) }],
  [0x19, (c) => { rr(c, C) }],
  [0x1A, (c) => { rr(c, D) }],
  [0x1B, (c) => { rr(c, E) }],
  [0x1C, (c) => { rr(c, H) }],
  [0x1D, (c) => { rr(c, L) }],
  [0x1F, (c) => { rr(c, A) }],
  [0x20, (c) => { sla(c, B) }],
  [0x21, (c) => { sla(c, C) }],
  [0x22, (c) => { sla(c, D) }],
  [0x23, (c) => { sla(c, E) }],
  [0x24, (c) => { sla(c, H) }],
  [0x25, (c) => { sla(c, L) }],
  [0x27, (c) => { sla(c, A) }],
  [0x28, (c) => { sra(c, B) }],
  [0x29, (c) => { sra(c, C) }],
  [0x2A, (c) => { sra(c, D) }],
  [0x2B, (c) => { sra(c, E) }],
  [0x2C, (c) => { sra(c, H) }],
  [0x2D, (c) => { sra(c, L) }],
  [0x2F, (c) => { sra(c, A) }],
  [0x30, (c) => { swap(c, B) }],
  [0x31, (c) => { swap(c, C) }],
  [0x32, (c) => { swap(c, D) }],
  [0x33, (c) => { swap(c, E) }],
  [0x34, (c) => { swap(c, H) }],
  [0x35, (c) => { swap(c, L) }],
  [0x37, (c) => { swap(c, A) }],
  [0x38, (c) => { slr(c, B) }],
  [0x39, (c) => { slr(c, C) }],
  [0x3A, (c) => { slr(c, D) }],
  [0x3B, (c) => { slr(c, E) }],
  [0x3C, (c) => { slr(c, H) }],
  [0x3D, (c) => { slr(c, L) }],
  [0x3F, (c) => { slr(c, A) }]
])

function sla (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  carryFlag(c, (value & 0x80) !== 0)
  value = value << 1
  value = value & 0xff
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function slr (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  carryFlag(c, (value & 0x01) !== 0)
  value = value >> 1
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function sra (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  carryFlag(c, (value & 0x01) !== 0)
  value = (value & 0x80) | (value >> 1)
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

function swap (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  value = uint8((value & 0x0f) << 4) | ((value & 0xf0) >> 4)
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry | CpuFlags.Carry)
}

function rlc (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  const carry = (value & 0x80) >> 7
  carryFlag(c, (value & 0x80) > 0)
  value = value << 1
  value += carry
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rl (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  const carry = c.regs.check(CpuFlags.Carry) ? 1 : 0
  carryFlag(c, (value & 0x80) > 0)
  value = (value << 1)
  value = value & 0xff
  value += carry
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rrc (c: InstructionContext, reg: string): void {
  let value = c.regs.get(reg)
  const carry = value & 0x01
  value = value >> 1
  carryFlag(c, carry > 0)

  if (carry > 0) {
    value |= 0x80
  }
  c.regs.set(reg, value)
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}
