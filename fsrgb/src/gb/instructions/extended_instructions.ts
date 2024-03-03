import { type InstructionContext } from './instruction_context'
import { A, B, C, CpuFlags, D, E, H, L } from '../registers'
import { carryFlag, zeroFlag, zeroFlagBool } from './flags'
import { uint8 } from '../helpers'

export const ExtendedInstructions = new Map<number, (context: InstructionContext) => void>([
  [0x00, (c) => { rlc(c, regRef(c, B)) }],
  [0x01, (c) => { rlc(c, regRef(c, C)) }],
  [0x02, (c) => { rlc(c, regRef(c, D)) }],
  [0x03, (c) => { rlc(c, regRef(c, E)) }],
  [0x04, (c) => { rlc(c, regRef(c, H)) }],
  [0x05, (c) => { rlc(c, regRef(c, L)) }],
  [0x06, (c) => { rlc(c, memRef(c, c.HL)) }],
  [0x07, (c) => { rlc(c, regRef(c, A)) }],
  [0x08, (c) => { rrc(c, regRef(c, B)) }],
  [0x09, (c) => { rrc(c, regRef(c, C)) }],
  [0x0A, (c) => { rrc(c, regRef(c, D)) }],
  [0x0B, (c) => { rrc(c, regRef(c, E)) }],
  [0x0C, (c) => { rrc(c, regRef(c, H)) }],
  [0x0D, (c) => { rrc(c, regRef(c, L)) }],
  [0x0E, (c) => { rrc(c, memRef(c, c.HL)) }],
  [0x0F, (c) => { rrc(c, regRef(c, A)) }],
  [0x10, (c) => { rl(c, regRef(c, B)) }],
  [0x11, (c) => { rl(c, regRef(c, C)) }],
  [0x12, (c) => { rl(c, regRef(c, D)) }],
  [0x13, (c) => { rl(c, regRef(c, E)) }],
  [0x14, (c) => { rl(c, regRef(c, H)) }],
  [0x15, (c) => { rl(c, regRef(c, L)) }],
  [0x16, (c) => { rl(c, memRef(c, c.HL)) }],
  [0x17, (c) => { rl(c, regRef(c, A)) }],
  [0x18, (c) => { rr(c, regRef(c, B)) }],
  [0x19, (c) => { rr(c, regRef(c, C)) }],
  [0x1A, (c) => { rr(c, regRef(c, D)) }],
  [0x1B, (c) => { rr(c, regRef(c, E)) }],
  [0x1C, (c) => { rr(c, regRef(c, H)) }],
  [0x1D, (c) => { rr(c, regRef(c, L)) }],
  [0x1E, (c) => { rr(c, memRef(c, c.HL)) }],
  [0x1F, (c) => { rr(c, regRef(c, A)) }],
  [0x20, (c) => { sla(c, regRef(c, B)) }],
  [0x21, (c) => { sla(c, regRef(c, C)) }],
  [0x22, (c) => { sla(c, regRef(c, D)) }],
  [0x23, (c) => { sla(c, regRef(c, E)) }],
  [0x24, (c) => { sla(c, regRef(c, H)) }],
  [0x25, (c) => { sla(c, regRef(c, L)) }],
  [0x26, (c) => { sla(c, memRef(c, c.HL)) }],
  [0x27, (c) => { sla(c, regRef(c, A)) }],
  [0x28, (c) => { sra(c, regRef(c, B)) }],
  [0x29, (c) => { sra(c, regRef(c, C)) }],
  [0x2A, (c) => { sra(c, regRef(c, D)) }],
  [0x2B, (c) => { sra(c, regRef(c, E)) }],
  [0x2C, (c) => { sra(c, regRef(c, H)) }],
  [0x2D, (c) => { sra(c, regRef(c, L)) }],
  [0x2E, (c) => { sra(c, memRef(c, c.HL)) }],
  [0x2F, (c) => { sra(c, regRef(c, A)) }],
  [0x30, (c) => { swap(c, regRef(c, B)) }],
  [0x31, (c) => { swap(c, regRef(c, C)) }],
  [0x32, (c) => { swap(c, regRef(c, D)) }],
  [0x33, (c) => { swap(c, regRef(c, E)) }],
  [0x34, (c) => { swap(c, regRef(c, H)) }],
  [0x35, (c) => { swap(c, regRef(c, L)) }],
  [0x36, (c) => { swap(c, memRef(c, c.HL)) }],
  [0x37, (c) => { swap(c, regRef(c, A)) }],
  [0x38, (c) => { slr(c, regRef(c, B)) }],
  [0x39, (c) => { slr(c, regRef(c, C)) }],
  [0x3A, (c) => { slr(c, regRef(c, D)) }],
  [0x3B, (c) => { slr(c, regRef(c, E)) }],
  [0x3C, (c) => { slr(c, regRef(c, H)) }],
  [0x3D, (c) => { slr(c, regRef(c, L)) }],
  [0x3E, (c) => { slr(c, memRef(c, c.HL)) }],
  [0x3F, (c) => { slr(c, regRef(c, A)) }],

  [0x40, (c) => { bit(c, 0, c.B) }],
  [0x41, (c) => { bit(c, 0, c.C) }],
  [0x42, (c) => { bit(c, 0, c.D) }],
  [0x43, (c) => { bit(c, 0, c.E) }],
  [0x44, (c) => { bit(c, 0, c.H) }],
  [0x45, (c) => { bit(c, 0, c.L) }],
  [0x46, (c) => { bit(c, 0, c.mmu.read(c.HL)) }],
  [0x47, (c) => { bit(c, 0, c.A) }],
  [0x48, (c) => { bit(c, 1, c.B) }],
  [0x49, (c) => { bit(c, 1, c.C) }],
  [0x4A, (c) => { bit(c, 1, c.D) }],
  [0x4B, (c) => { bit(c, 1, c.E) }],
  [0x4C, (c) => { bit(c, 1, c.H) }],
  [0x4D, (c) => { bit(c, 1, c.L) }],
  [0x4E, (c) => { bit(c, 1, c.mmu.read(c.HL)) }],
  [0x4F, (c) => { bit(c, 1, c.A) }],

  [0x50, (c) => { bit(c, 2, c.B) }],
  [0x51, (c) => { bit(c, 2, c.C) }],
  [0x52, (c) => { bit(c, 2, c.D) }],
  [0x53, (c) => { bit(c, 2, c.E) }],
  [0x54, (c) => { bit(c, 2, c.H) }],
  [0x55, (c) => { bit(c, 2, c.L) }],
  [0x56, (c) => { bit(c, 2, c.mmu.read(c.HL)) }],
  [0x57, (c) => { bit(c, 2, c.A) }],
  [0x58, (c) => { bit(c, 3, c.B) }],
  [0x59, (c) => { bit(c, 3, c.C) }],
  [0x5A, (c) => { bit(c, 3, c.D) }],
  [0x5B, (c) => { bit(c, 3, c.E) }],
  [0x5C, (c) => { bit(c, 3, c.H) }],
  [0x5D, (c) => { bit(c, 3, c.L) }],
  [0x5E, (c) => { bit(c, 3, c.mmu.read(c.HL)) }],
  [0x5F, (c) => { bit(c, 3, c.A) }],

  [0x60, (c) => { bit(c, 4, c.B) }],
  [0x61, (c) => { bit(c, 4, c.C) }],
  [0x62, (c) => { bit(c, 4, c.D) }],
  [0x63, (c) => { bit(c, 4, c.E) }],
  [0x64, (c) => { bit(c, 4, c.H) }],
  [0x65, (c) => { bit(c, 4, c.L) }],
  [0x66, (c) => { bit(c, 4, c.mmu.read(c.HL)) }],
  [0x67, (c) => { bit(c, 4, c.A) }],
  [0x68, (c) => { bit(c, 5, c.B) }],
  [0x69, (c) => { bit(c, 5, c.C) }],
  [0x6A, (c) => { bit(c, 5, c.D) }],
  [0x6B, (c) => { bit(c, 5, c.E) }],
  [0x6C, (c) => { bit(c, 5, c.H) }],
  [0x6D, (c) => { bit(c, 5, c.L) }],
  [0x6E, (c) => { bit(c, 5, c.mmu.read(c.HL)) }],
  [0x6F, (c) => { bit(c, 5, c.A) }],

  [0x70, (c) => { bit(c, 6, c.B) }],
  [0x71, (c) => { bit(c, 6, c.C) }],
  [0x72, (c) => { bit(c, 6, c.D) }],
  [0x73, (c) => { bit(c, 6, c.E) }],
  [0x74, (c) => { bit(c, 6, c.H) }],
  [0x75, (c) => { bit(c, 6, c.L) }],
  [0x76, (c) => { bit(c, 6, c.mmu.read(c.HL)) }],
  [0x77, (c) => { bit(c, 6, c.A) }],
  [0x78, (c) => { bit(c, 7, c.B) }],
  [0x79, (c) => { bit(c, 7, c.C) }],
  [0x7A, (c) => { bit(c, 7, c.D) }],
  [0x7B, (c) => { bit(c, 7, c.E) }],
  [0x7C, (c) => { bit(c, 7, c.H) }],
  [0x7D, (c) => { bit(c, 7, c.L) }],
  [0x7E, (c) => { bit(c, 7, c.mmu.read(c.HL)) }],
  [0x7F, (c) => { bit(c, 7, c.A) }],

  [0x80, (c) => { res(c, 0, regRef(c, B)) }],
  [0x81, (c) => { res(c, 0, regRef(c, C)) }],
  [0x82, (c) => { res(c, 0, regRef(c, D)) }],
  [0x83, (c) => { res(c, 0, regRef(c, E)) }],
  [0x84, (c) => { res(c, 0, regRef(c, H)) }],
  [0x85, (c) => { res(c, 0, regRef(c, L)) }],
  [0x86, (c) => { res(c, 0, memRef(c, c.HL)) }],
  [0x87, (c) => { res(c, 0, regRef(c, A)) }],
  [0x88, (c) => { res(c, 1, regRef(c, B)) }],
  [0x89, (c) => { res(c, 1, regRef(c, C)) }],
  [0x8A, (c) => { res(c, 1, regRef(c, D)) }],
  [0x8B, (c) => { res(c, 1, regRef(c, E)) }],
  [0x8C, (c) => { res(c, 1, regRef(c, H)) }],
  [0x8D, (c) => { res(c, 1, regRef(c, L)) }],
  [0x8E, (c) => { res(c, 1, memRef(c, c.HL)) }],
  [0x8F, (c) => { res(c, 1, regRef(c, A)) }],

  [0x90, (c) => { res(c, 2, regRef(c, B)) }],
  [0x91, (c) => { res(c, 2, regRef(c, C)) }],
  [0x92, (c) => { res(c, 2, regRef(c, D)) }],
  [0x93, (c) => { res(c, 2, regRef(c, E)) }],
  [0x94, (c) => { res(c, 2, regRef(c, H)) }],
  [0x95, (c) => { res(c, 2, regRef(c, L)) }],
  [0x96, (c) => { res(c, 2, memRef(c, c.HL)) }],
  [0x97, (c) => { res(c, 2, regRef(c, A)) }],
  [0x98, (c) => { res(c, 3, regRef(c, B)) }],
  [0x99, (c) => { res(c, 3, regRef(c, C)) }],
  [0x9A, (c) => { res(c, 3, regRef(c, D)) }],
  [0x9B, (c) => { res(c, 3, regRef(c, E)) }],
  [0x9C, (c) => { res(c, 3, regRef(c, H)) }],
  [0x9D, (c) => { res(c, 3, regRef(c, L)) }],
  [0x9E, (c) => { res(c, 3, memRef(c, c.HL)) }],
  [0x9F, (c) => { res(c, 3, regRef(c, A)) }],

  [0xA0, (c) => { res(c, 4, regRef(c, B)) }],
  [0xA1, (c) => { res(c, 4, regRef(c, C)) }],
  [0xA2, (c) => { res(c, 4, regRef(c, D)) }],
  [0xA3, (c) => { res(c, 4, regRef(c, E)) }],
  [0xA4, (c) => { res(c, 4, regRef(c, H)) }],
  [0xA5, (c) => { res(c, 4, regRef(c, L)) }],
  [0xA6, (c) => { res(c, 4, memRef(c, c.HL)) }],
  [0xA7, (c) => { res(c, 4, regRef(c, A)) }],
  [0xA8, (c) => { res(c, 5, regRef(c, B)) }],
  [0xA9, (c) => { res(c, 5, regRef(c, C)) }],
  [0xAA, (c) => { res(c, 5, regRef(c, D)) }],
  [0xAB, (c) => { res(c, 5, regRef(c, E)) }],
  [0xAC, (c) => { res(c, 5, regRef(c, H)) }],
  [0xAD, (c) => { res(c, 5, regRef(c, L)) }],
  [0xAE, (c) => { res(c, 5, memRef(c, c.HL)) }],
  [0xAF, (c) => { res(c, 5, regRef(c, A)) }],

  [0xB0, (c) => { res(c, 6, regRef(c, B)) }],
  [0xB1, (c) => { res(c, 6, regRef(c, C)) }],
  [0xB2, (c) => { res(c, 6, regRef(c, D)) }],
  [0xB3, (c) => { res(c, 6, regRef(c, E)) }],
  [0xB4, (c) => { res(c, 6, regRef(c, H)) }],
  [0xB5, (c) => { res(c, 6, regRef(c, L)) }],
  [0xB6, (c) => { res(c, 6, memRef(c, c.HL)) }],
  [0xB7, (c) => { res(c, 6, regRef(c, A)) }],
  [0xB8, (c) => { res(c, 7, regRef(c, B)) }],
  [0xB9, (c) => { res(c, 7, regRef(c, C)) }],
  [0xBA, (c) => { res(c, 7, regRef(c, D)) }],
  [0xBB, (c) => { res(c, 7, regRef(c, E)) }],
  [0xBC, (c) => { res(c, 7, regRef(c, H)) }],
  [0xBD, (c) => { res(c, 7, regRef(c, L)) }],
  [0xBE, (c) => { res(c, 7, memRef(c, c.HL)) }],
  [0xBF, (c) => { res(c, 7, regRef(c, A)) }],

  [0xC0, (c) => { set(c, 0, regRef(c, B)) }],
  [0xC1, (c) => { set(c, 0, regRef(c, C)) }],
  [0xC2, (c) => { set(c, 0, regRef(c, D)) }],
  [0xC3, (c) => { set(c, 0, regRef(c, E)) }],
  [0xC4, (c) => { set(c, 0, regRef(c, H)) }],
  [0xC5, (c) => { set(c, 0, regRef(c, L)) }],
  [0xC6, (c) => { set(c, 0, memRef(c, c.HL)) }],
  [0xC7, (c) => { set(c, 0, regRef(c, A)) }],
  [0xC8, (c) => { set(c, 1, regRef(c, B)) }],
  [0xC9, (c) => { set(c, 1, regRef(c, C)) }],
  [0xCA, (c) => { set(c, 1, regRef(c, D)) }],
  [0xCB, (c) => { set(c, 1, regRef(c, E)) }],
  [0xCC, (c) => { set(c, 1, regRef(c, H)) }],
  [0xCD, (c) => { set(c, 1, regRef(c, L)) }],
  [0xCE, (c) => { set(c, 1, memRef(c, c.HL)) }],
  [0xCF, (c) => { set(c, 1, regRef(c, A)) }],

  [0xD0, (c) => { set(c, 2, regRef(c, B)) }],
  [0xD1, (c) => { set(c, 2, regRef(c, C)) }],
  [0xD2, (c) => { set(c, 2, regRef(c, D)) }],
  [0xD3, (c) => { set(c, 2, regRef(c, E)) }],
  [0xD4, (c) => { set(c, 2, regRef(c, H)) }],
  [0xD5, (c) => { set(c, 2, regRef(c, L)) }],
  [0xD6, (c) => { set(c, 2, memRef(c, c.HL)) }],
  [0xD7, (c) => { set(c, 2, regRef(c, A)) }],
  [0xD8, (c) => { set(c, 3, regRef(c, B)) }],
  [0xD9, (c) => { set(c, 3, regRef(c, C)) }],
  [0xDA, (c) => { set(c, 3, regRef(c, D)) }],
  [0xDB, (c) => { set(c, 3, regRef(c, E)) }],
  [0xDC, (c) => { set(c, 3, regRef(c, H)) }],
  [0xDD, (c) => { set(c, 3, regRef(c, L)) }],
  [0xDE, (c) => { set(c, 3, memRef(c, c.HL)) }],
  [0xDF, (c) => { set(c, 3, regRef(c, A)) }],

  [0xE0, (c) => { set(c, 4, regRef(c, B)) }],
  [0xE1, (c) => { set(c, 4, regRef(c, C)) }],
  [0xE2, (c) => { set(c, 4, regRef(c, D)) }],
  [0xE3, (c) => { set(c, 4, regRef(c, E)) }],
  [0xE4, (c) => { set(c, 4, regRef(c, H)) }],
  [0xE5, (c) => { set(c, 4, regRef(c, L)) }],
  [0xE6, (c) => { set(c, 4, memRef(c, c.HL)) }],
  [0xE7, (c) => { set(c, 4, regRef(c, A)) }],
  [0xE8, (c) => { set(c, 5, regRef(c, B)) }],
  [0xE9, (c) => { set(c, 5, regRef(c, C)) }],
  [0xEA, (c) => { set(c, 5, regRef(c, D)) }],
  [0xEB, (c) => { set(c, 5, regRef(c, E)) }],
  [0xEC, (c) => { set(c, 5, regRef(c, H)) }],
  [0xED, (c) => { set(c, 5, regRef(c, L)) }],
  [0xEE, (c) => { set(c, 5, memRef(c, c.HL)) }],
  [0xEF, (c) => { set(c, 5, regRef(c, A)) }],

  [0xF0, (c) => { set(c, 6, regRef(c, B)) }],
  [0xF1, (c) => { set(c, 6, regRef(c, C)) }],
  [0xF2, (c) => { set(c, 6, regRef(c, D)) }],
  [0xF3, (c) => { set(c, 6, regRef(c, E)) }],
  [0xF4, (c) => { set(c, 6, regRef(c, H)) }],
  [0xF5, (c) => { set(c, 6, regRef(c, L)) }],
  [0xF6, (c) => { set(c, 6, memRef(c, c.HL)) }],
  [0xF7, (c) => { set(c, 6, regRef(c, A)) }],
  [0xF8, (c) => { set(c, 7, regRef(c, B)) }],
  [0xF9, (c) => { set(c, 7, regRef(c, C)) }],
  [0xFA, (c) => { set(c, 7, regRef(c, D)) }],
  [0xFB, (c) => { set(c, 7, regRef(c, E)) }],
  [0xFC, (c) => { set(c, 7, regRef(c, H)) }],
  [0xFD, (c) => { set(c, 7, regRef(c, L)) }],
  [0xFE, (c) => { set(c, 7, memRef(c, c.HL)) }],
  [0xFF, (c) => { set(c, 7, regRef(c, A)) }]
])

function sla (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  carryFlag(c, (value & 0x80) !== 0)
  value = value << 1
  value = value & 0xff
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function slr (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  carryFlag(c, (value & 0x01) !== 0)
  value = value >> 1
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function sra (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  carryFlag(c, (value & 0x01) !== 0)
  value = (value & 0x80) | (value >> 1)
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rr (c: InstructionContext, accessor: ByteAccessor): void {
  const prevC = c.regs.check(CpuFlags.Carry)
  let value = accessor.value
  carryFlag(c, (value & 0x01) > 0)
  value = value >> 1
  if (prevC) {
    value |= 0x80
  }
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function swap (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  value = uint8((value & 0x0f) << 4) | ((value & 0xf0) >> 4)
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry | CpuFlags.Carry)
}

function rlc (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  const carry = (value & 0x80) >> 7
  carryFlag(c, (value & 0x80) > 0)
  value = value << 1
  value += carry
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rl (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  const carry = c.regs.check(CpuFlags.Carry) ? 1 : 0
  carryFlag(c, (value & 0x80) > 0)
  value = (value << 1)
  value = value & 0xff
  value += carry
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function rrc (c: InstructionContext, accessor: ByteAccessor): void {
  let value = accessor.value
  const carry = value & 0x01
  value = value >> 1
  carryFlag(c, carry > 0)

  if (carry > 0) {
    value |= 0x80
  }
  accessor.value = value
  zeroFlag(c, value)
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.HalfCarry)
}

function bit (c: InstructionContext, bit: number, value: number): void {
  zeroFlagBool(c, (value & (1 << bit)) === 0)
  c.regs.clear_flag(CpuFlags.Negative)
  c.regs.set_flag(CpuFlags.HalfCarry)
}

function res (c: InstructionContext, bit: number, accessor: ByteAccessor): void {
  accessor.value &= uint8(~(1 << bit))
}

function set (c: InstructionContext, bit: number, accessor: ByteAccessor): void {
  accessor.value |= uint8(1 << bit)
}

interface ByteAccessor {
  value: number
}

class RegisterAccessor implements ByteAccessor {
  constructor (private readonly c: InstructionContext, private readonly reg: string) {

  }

  get value (): number {
    return this.c.regs.get(this.reg)
  }

  set value (val: number) {
    this.c.regs.set(this.reg, val)
  }
}

class MemoryAccessor implements ByteAccessor {
  constructor (private readonly c: InstructionContext, private readonly addr: number) {

  }

  get value (): number {
    return this.c.mmu.read(this.addr)
  }

  set value (val: number) {
    this.c.mmu.write(this.addr, val)
  }
}

function memRef (c: InstructionContext, addr: number): ByteAccessor {
  return new MemoryAccessor(c, addr)
}

function regRef (c: InstructionContext, reg: string): ByteAccessor {
  return new RegisterAccessor(c, reg)
}
