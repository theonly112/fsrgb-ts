import { ExtendedInstructions } from './extended_instructions'
import { type InstructionContext } from './instruction_context'
import { ExtendedInstructionTicks } from './instruction_ticks'
import { A, B, C, CpuFlags, D, E, H, HL, L, PC, SP } from '../registers'
import { carryFlag, halfCarryFlag, zeroFlag, zeroFlagBool } from './flags'
import { int8 } from '../helpers'

export const Instructions = new Map<number, (context: InstructionContext) => void>([
  [0x00, () => { }],
  [0x01, (c) => { c.BC = readArgWord(c) }],
  [0x03, (c) => { c.BC++ }],
  [0x05, (c) => { dec(c, B) }],
  [0x06, (c) => { c.B = readArgByte(c) }],
  [0x08, (c) => { c.mmu.write_word(readArgWord(c), c.SP) }],
  [0x0B, (c) => { c.BC-- }],
  [0x0C, (c) => { inc(c, C) }],
  [0x0D, (c) => { dec(c, C) }],
  [0x0E, (c) => { c.C = readArgByte(c) }],
  [0x11, (c) => { c.DE = readArgWord(c) }],
  [0x12, (c) => { c.mmu.write(c.DE, c.A) }],
  [0x13, (c) => { c.DE++ }],
  [0x14, (c) => { inc(c, D) }],
  [0x18, (c) => { jr_n(c) }],
  [0x1a, (c) => { c.A = c.mmu.read(c.DE) }],
  [0x1C, (c) => { inc(c, E) }],
  [0x1D, (c) => { dec(c, E) }],
  [0x1F, rra],
  [0x20, jr_nz_n],
  [0x21, (c) => { c.HL = readArgWord(c) }],
  [0x22, (c) => { c.mmu.write(c.HL++, c.A) }],
  [0x23, (c) => { c.HL++ }],
  [0x24, (c) => { inc(c, H) }],
  [0x25, (c) => { dec(c, H) }],
  [0x26, (c) => { c.H = readArgByte(c) }],
  [0x28, jr_z_n],
  [0x29, (c) => { addHLR16(c, HL) }],
  [0x2a, (c) => { c.A = c.mmu.read(c.HL++) }],
  [0x2c, (c) => { inc(c, L) }],
  [0x2D, (c) => { dec(c, L) }],
  [0x2E, (c) => { c.L = readArgByte(c) }],
  [0x30, jr_nc_n],
  [0x31, (c) => { c.SP = readArgWord(c) }],
  [0x32, (c) => { ldd(c, HL, A) }],
  [0x33, (c) => { c.SP++ }],
  [0x35, (c) => { decHL(c, c.HL) }],
  [0x36, (c) => { c.mmu.write(c.HL, readArgByte(c)) }],
  [0x38, jr_c_n],
  [0x39, (c) => { addHLR16(c, SP) }],
  [0x3B, (c) => { c.SP-- }],
  [0x3C, (c) => { inc(c, A) }],
  [0x3D, (c) => { dec(c, A) }],
  [0x3E, (c) => { c.A = readArgByte(c) }],
  [0x40, (c) => { /* no op c.B = c.B */ }],
  [0x41, (c) => { c.B = c.C }],
  [0x42, (c) => { c.B = c.D }],
  [0x43, (c) => { c.B = c.E }],
  [0x44, (c) => { c.B = c.H }],
  [0x45, (c) => { c.B = c.L }],
  [0x46, (c) => { c.B = c.mmu.read(c.HL) }],
  [0x47, (c) => { c.B = c.A }],
  [0x48, (c) => { c.C = c.B }],
  [0x49, (c) => { /* no op c.C = c.C */ }],
  [0x4A, (c) => { c.C = c.D }],
  [0x4B, (c) => { c.C = c.E }],
  [0x4C, (c) => { c.C = c.H }],
  [0x4D, (c) => { c.C = c.L }],
  [0x4E, (c) => { c.C = c.mmu.read(c.HL) }],
  [0x4F, (c) => { c.C = c.A }],
  [0x50, (c) => { c.D = c.B }],
  [0x51, (c) => { c.D = c.C }],
  [0x52, (c) => { /* no op c.D = c.D */ }],
  [0x53, (c) => { c.D = c.E }],
  [0x54, (c) => { c.D = c.H }],
  [0x55, (c) => { c.D = c.L }],
  [0x56, (c) => { c.D = c.mmu.read(c.HL) }],
  [0x57, (c) => { c.D = c.A }],
  [0x58, (c) => { c.E = c.B }],
  [0x59, (c) => { c.E = c.C }],
  [0x5A, (c) => { c.E = c.D }],
  [0x5B, (c) => { /* no op c.E = c.E */ }],
  [0x5C, (c) => { c.E = c.H }],
  [0x5D, (c) => { c.E = c.L }],
  [0x5E, (c) => { c.E = c.mmu.read(c.HL) }],
  [0x5F, (c) => { c.E = c.A }],
  [0x60, (c) => { c.H = c.B }],
  [0x61, (c) => { c.H = c.C }],
  [0x62, (c) => { c.H = c.D }],
  [0x63, (c) => { c.H = c.E }],
  [0x64, (c) => { /* no op c.H = c.H */ }],
  [0x65, (c) => { c.H = c.L }],
  [0x66, (c) => { c.H = c.mmu.read(c.HL) }],
  [0x67, (c) => { c.H = c.A }],
  [0x68, (c) => { c.L = c.B }],
  [0x69, (c) => { c.L = c.C }],
  [0x6A, (c) => { c.L = c.D }],
  [0x6B, (c) => { c.L = c.E }],
  [0x6C, (c) => { c.L = c.H }],
  [0x6D, (c) => { /* no op c.L = c.L */ }],
  [0x6E, (c) => { c.L = c.mmu.read(c.HL) }],
  [0x6F, (c) => { c.L = c.A }],
  [0x70, (c) => { c.mmu.write(c.HL, c.B) }],
  [0x71, (c) => { c.mmu.write(c.HL, c.C) }],
  [0x72, (c) => { c.mmu.write(c.HL, c.D) }],
  [0x73, (c) => { c.mmu.write(c.HL, c.E) }],
  [0x74, (c) => { c.mmu.write(c.HL, c.H) }],
  [0x75, (c) => { c.mmu.write(c.HL, c.L) }],
  [0x77, (c) => { c.mmu.write(c.HL, c.A) }],
  [0x78, (c) => { c.A = c.B }],
  [0x79, (c) => { c.A = c.C }],
  [0x7A, (c) => { c.A = c.D }],
  [0x7B, (c) => { c.A = c.E }],
  [0x7C, (c) => { c.A = c.H }],
  [0x7D, (c) => { c.A = c.L }],
  [0x7E, (c) => { c.A = c.mmu.read(c.HL) }],
  [0x7F, (c) => { /* no op c.A = c.A */ }],
  [0xA9, (c) => { xor(c, c.C) }],
  [0xAD, (c) => { xor(c, c.L) }],
  [0xAE, (c) => { xor(c, c.mmu.read(c.HL)) }],
  [0xAF, (c) => { xor(c, c.regs.get(A)) }],
  [0xB0, (c) => { or(c, c.B) }],
  [0xB1, (c) => { or(c, c.C) }],
  [0xB6, (c) => { or(c, c.mmu.read(c.HL)) }],
  [0xB7, (c) => { or(c, c.A) }],
  [0xC0, ret_nz],
  [0xC1, (c) => { c.BC = popWord(c) }],
  [0xC2, jp_nz_nn],
  [0xC3, (c) => { c.PC = readArgWord(c) }],
  [0xC4, (c) => { call_nz_nn(c) }],
  [0xC5, (c) => { pushWord(c, c.BC) }],
  [0xC6, (c) => { addA(c, readArgByte(c)) }],
  [0xC7, (c) => { rst(c, 0x0000) }],
  [0xC8, ret_z],
  [0xC9, (c) => { c.PC = popWord(c) }],
  [0xCA, jp_z_nn],
  [0xCB, (c) => { extendedInstruction(c) }],
  [0xCC, call_z_nn],
  [0xCD, (c) => { callNN(c) }],
  [0xCE, (c) => { adc(c, readArgByte(c)) }],
  [0xCF, (c) => { rst(c, 0x0008) }],
  [0xD0, ret_nc],
  [0xD1, (c) => { c.DE = popWord(c) }],
  [0xD2, jp_nc_nn],
  [0xD4, call_nc_nn],
  [0xD5, (c) => { pushWord(c, c.DE) }],
  [0xD6, (c) => { sub(c, readArgByte(c)) }],
  [0xD7, (c) => { rst(c, 0x0010) }],
  [0xD8, ret_c],
  [0xD9, reti],
  [0xDA, jp_c_nn],
  [0xDC, call_c_nn],
  [0xDF, (c) => { rst(c, 0x0018) }],
  [0xe0, (c) => { c.mmu.write(0xFF00 + readArgByte(c), c.A) }],
  [0xe1, (c) => { c.HL = popWord(c) }],
  [0xe2, (c) => { c.mmu.write(0xFF00 + c.C, c.A) }],
  [0xe5, (c) => { pushWord(c, c.HL) }],
  [0xe6, (c) => { and(c, readArgByte(c)) }],
  [0xe7, (c) => { rst(c, 0x0020) }],
  [0xe8, add_sp_n],
  [0xe9, (c) => { c.PC = c.HL }],
  [0xea, (c) => { c.mmu.write(readArgWord(c), c.A) }],
  [0xee, (c) => { xor(c, readArgByte(c)) }],
  [0xef, (c) => { rst(c, 0x0028) }],
  [0xF0, (c) => { c.regs.set(A, c.mmu.read(0xFF00 + readArgByte(c))) }],
  [0xF1, (c) => { c.AF = popWord(c); c.F &= 0xF0 }],
  [0xFE, (c) => { cp(c, readArgByte(c)) }],
  [0xF3, disableIme],
  [0xF5, (c) => { pushWord(c, c.AF) }],
  [0xF7, (c) => { rst(c, 0x0030) }],
  [0xF8, ld_hl_sp_n],
  [0xF9, (c) => { c.SP = c.HL }],
  [0xFA, (c) => { c.A = c.mmu.read(readArgWord(c)) }],
  [0xFF, (c) => { rst(c, 0x0038) }]
])

function readArgByte (c: InstructionContext): number {
  const pc = c.regs.get(PC)
  const v = c.mmu.read(pc)
  c.regs.set(PC, pc + 1)
  return v
}

function readArgWord (c: InstructionContext): number {
  const v = c.mmu.read_word(c.PC)
  c.PC += 2
  return v
}

function xor (c: InstructionContext, value: number): void {
  let a = c.regs.get(A)
  a ^= value
  c.regs.set(A, a)
  zeroFlag(c, a)
  c.regs.clear_flag(CpuFlags.Carry | CpuFlags.Negative | CpuFlags.HalfCarry)
}

function or (c: InstructionContext, value: number): void {
  let a = c.regs.get(A)
  a |= value
  c.regs.set(A, a)
  zeroFlag(c, a)
  c.regs.clear_flag(CpuFlags.Carry | CpuFlags.Negative | CpuFlags.HalfCarry)
}

function and (c: InstructionContext, value: number): void {
  c.A &= value
  zeroFlag(c, c.A)
  c.regs.clear_flag(CpuFlags.Carry | CpuFlags.Negative)
  c.regs.set_flag(CpuFlags.HalfCarry)
}

function ldd (c: InstructionContext, dst: string, src: string): void {
  let v = c.regs.get(dst)
  c.mmu.write(v--, c.regs.get(src))
  c.regs.set(dst, v)
}

function dec (c: InstructionContext, reg: string): void {
  let v = c.regs.get(reg)
  halfCarryFlag(c, (v & 0x0f) === 0)
  v = (v - 1) & 0xff
  c.regs.set(reg, v)
  zeroFlag(c, v)
  c.regs.set_flag(CpuFlags.Negative)
}

function decHL (c: InstructionContext, addr: number): void {
  let v = c.mmu.read(addr)
  halfCarryFlag(c, (v & 0x0f) === 0)
  v = (v - 1) & 0xff
  c.mmu.write(addr, v)
  zeroFlag(c, v)
  c.regs.set_flag(CpuFlags.Negative)
}

function inc (c: InstructionContext, reg: string): void {
  let v = c.regs.get(reg)
  halfCarryFlag(c, (v & 0x0f) === 0x0f)
  v = (v + 1) & 0xff
  c.regs.set(reg, v)
  zeroFlag(c, v)
  c.regs.clear_flag(CpuFlags.Negative)
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jr_nz_n (c: InstructionContext): void {
  const a = int8(readArgByte(c))
  if (!c.regs.check(CpuFlags.Zero)) {
    c.regs.set(PC, c.regs.get(PC) + a)
    c.cycles += 12
  } else {
    c.cycles += 8
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jr_z_n (c: InstructionContext): void {
  const a = int8(readArgByte(c))
  if (c.regs.check(CpuFlags.Zero)) {
    c.regs.set(PC, c.regs.get(PC) + a)
    c.cycles += 12
  } else {
    c.cycles += 8
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jr_nc_n (c: InstructionContext): void {
  const a = int8(readArgByte(c))
  if (c.regs.check(CpuFlags.Carry)) {
    c.cycles += 8
  } else {
    c.regs.set(PC, c.regs.get(PC) + a)
    c.cycles += 12
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jr_c_n (c: InstructionContext): void {
  const a = int8(readArgByte(c))
  if (!c.regs.check(CpuFlags.Carry)) {
    c.cycles += 8
  } else {
    c.regs.set(PC, c.regs.get(PC) + a)
    c.cycles += 12
  }
}

function disableIme (context: InstructionContext): void {
  context.ime = false
}

function cp (c: InstructionContext, v: number): void {
  const a = c.regs.get(A)
  // Intentionally let this become a negative number.
  const result = (a - v)
  zeroFlagBool(c, a === v)
  carryFlag(c, (result >> 8) !== 0)
  halfCarryFlag(c, (v & 0x0f) > (a & 0x0f))
  c.regs.set_flag(CpuFlags.Negative)
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function call_z_nn (c: InstructionContext): void {
  const addr = readArgWord(c)
  if (c.regs.check(CpuFlags.Zero)) {
    pushWord(c, c.PC)
    c.PC = addr
    c.cycles += 24
  } else {
    c.cycles += 12
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function call_nc_nn (c: InstructionContext): void {
  const addr = readArgWord(c)
  if (!c.regs.check(CpuFlags.Carry)) {
    pushWord(c, c.PC)
    c.PC = addr
    c.cycles += 24
  } else {
    c.cycles += 12
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function call_c_nn (c: InstructionContext): void {
  const addr = readArgWord(c)
  if (c.regs.check(CpuFlags.Carry)) {
    pushWord(c, c.PC)
    c.PC = addr
    c.cycles += 24
  } else {
    c.cycles += 12
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function call_nz_nn (c: InstructionContext): void {
  const addr = readArgWord(c)
  if (!c.regs.check(CpuFlags.Zero)) {
    pushWord(c, c.PC)
    c.PC = addr
    c.cycles += 24
  } else {
    c.cycles += 12
  }
}

function callNN (c: InstructionContext): void {
  const addr = readArgWord(c)
  pushWord(c, c.PC)
  c.regs.set(PC, addr)
}

function pushWord (c: InstructionContext, addr: number): void {
  c.SP -= 2
  c.mmu.write_word(c.SP, addr)
}

function popWord (c: InstructionContext): number {
  const value = c.mmu.read_word(c.SP)
  c.SP += 2
  return value
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jr_n (c: InstructionContext): void {
  const relative = int8(readArgByte(c))
  c.PC = c.PC + relative
}

function addA (c: InstructionContext, rhs: number): void {
  const lhs = c.A
  const result = lhs + rhs
  carryFlag(c, (result & 0xff00) !== 0)
  halfCarryFlag(c, (lhs & 0x0f) + (rhs & 0x0f) > 0x0f)
  c.A = result & 0xff
  zeroFlag(c, c.A)
  c.regs.clear_flag(CpuFlags.Negative)
}

function sub (c: InstructionContext, rhs: number): void {
  const lhs = c.A
  const result = lhs - rhs
  c.regs.set_flag(CpuFlags.Negative)
  carryFlag(c, (result >> 8) !== 0)
  halfCarryFlag(c, (rhs & 0x0f) > (lhs & 0x0f))
  c.A = (result & 0xff)
  zeroFlag(c, c.A)
}

function extendedInstruction (c: InstructionContext): void {
  const num = c.mmu.read(c.PC++)
  const inst = ExtendedInstructions.get(num)
  if (inst !== undefined) {
    inst(c)
    c.cycles += ExtendedInstructionTicks[num]
  } else {
    throw new Error(`not implemented CB instruction ${num.toString(16)}`)
  }
}

function rra (c: InstructionContext): void {
  const carry = (c.regs.check(CpuFlags.Carry) ? 1 : 0) << 7
  carryFlag(c, (c.A & 0x01) !== 0)
  c.A = c.A >> 1
  c.A = c.A | carry
  c.regs.clear_flag(CpuFlags.Negative | CpuFlags.Zero | CpuFlags.HalfCarry)
}

function adc (c: InstructionContext, value: number): void {
  const carry = (c.regs.check(CpuFlags.Carry) ? 1 : 0)
  const result = c.A + value + carry
  carryFlag(c, (result & 0xff00) !== 0)
  zeroFlagBool(c, (result & 0xff) === 0)
  if (carry === 1) {
    halfCarryFlag(c, (value & 0x0f) + (c.A & 0x0f) >= 0x0f)
  } else {
    halfCarryFlag(c, (value & 0x0f) + (c.A & 0x0f) > 0x0f)
  }
  c.regs.clear_flag(CpuFlags.Negative)
  c.A = result & 0xff
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function ret_nc (c: InstructionContext): void {
  if (c.regs.check(CpuFlags.Carry)) {
    c.cycles += 8
  } else {
    c.PC = popWord(c)
    c.cycles += 20
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function ret_c (c: InstructionContext): void {
  if (c.regs.check(CpuFlags.Carry)) {
    c.PC = popWord(c)
    c.cycles += 20
  } else {
    c.cycles += 8
  }
}

function reti (c: InstructionContext): void {
  c.ime = true
  c.PC = popWord(c)
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function ret_nz (c: InstructionContext): void {
  if (!c.regs.check(CpuFlags.Zero)) {
    c.PC = popWord(c)
    c.cycles += 20
  } else {
    c.cycles += 8
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function ret_z (c: InstructionContext): void {
  if (c.regs.check(CpuFlags.Zero)) {
    c.PC = popWord(c)
    c.cycles += 20
  } else {
    c.cycles += 8
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jp_nz_nn (c: InstructionContext): void {
  const nn = readArgWord(c)
  if (c.regs.check(CpuFlags.Zero)) {
    c.cycles += 12
  } else {
    c.PC = nn
    c.cycles += 16
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jp_nc_nn (c: InstructionContext): void {
  const nn = readArgWord(c)
  if (c.regs.check(CpuFlags.Carry)) {
    c.cycles += 12
  } else {
    c.PC = nn
    c.cycles += 16
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jp_c_nn (c: InstructionContext): void {
  const nn = readArgWord(c)
  if (!c.regs.check(CpuFlags.Carry)) {
    c.cycles += 12
  } else {
    c.PC = nn
    c.cycles += 16
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function jp_z_nn (c: InstructionContext): void {
  const nn = readArgWord(c)
  if (!c.regs.check(CpuFlags.Zero)) {
    c.cycles += 12
  } else {
    c.PC = nn
    c.cycles += 16
  }
}

function addHLR16 (c: InstructionContext, reg: string): void {
  const value = c.regs.get(reg)
  const result = c.HL + value
  carryFlag(c, (result & 0xffff0000) !== 0)
  halfCarryFlag(c, (c.HL & 0xfff) + (value & 0xfff) > 0xfff)
  c.HL = (result & 0xffff)
  c.regs.clear_flag(CpuFlags.Negative)
}

function rst (c: InstructionContext, addr: number): void {
  pushWord(c, c.PC)
  c.PC = addr
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function add_sp_n (c: InstructionContext): void {
  const n = readArgByte(c)
  const result = c.SP + int8(n)
  carryFlag(c, ((c.SP & 0xff) + n) >> 8 !== 0)
  halfCarryFlag(c, (c.SP & 0x0f) + (n & 0x0f) > 0x0f)
  c.SP = result & 0xffff
  c.regs.clear_flag(CpuFlags.Zero | CpuFlags.Negative)
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function ld_hl_sp_n (c: InstructionContext): void {
  const n = readArgByte(c)
  const result = c.SP + int8(n)
  carryFlag(c, ((c.SP & 0xff) + n) >> 8 !== 0)
  halfCarryFlag(c, (c.SP & 0x0f) + (n & 0x0f) > 0x0f)
  c.regs.clear_flag(CpuFlags.Zero | CpuFlags.Negative)
  c.HL = result & 0xffff
}
