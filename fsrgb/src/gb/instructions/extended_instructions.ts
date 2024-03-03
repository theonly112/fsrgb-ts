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

  [0x46, (c) => { bit(c, 0, c.mmu.read(c.HL)) }],
  [0x4E, (c) => { bit(c, 1, c.mmu.read(c.HL)) }],
  [0x56, (c) => { bit(c, 2, c.mmu.read(c.HL)) }],
  [0x5E, (c) => { bit(c, 3, c.mmu.read(c.HL)) }],
  [0x66, (c) => { bit(c, 4, c.mmu.read(c.HL)) }],
  [0x6E, (c) => { bit(c, 5, c.mmu.read(c.HL)) }],
  [0x76, (c) => { bit(c, 6, c.mmu.read(c.HL)) }],
  [0x7E, (c) => { bit(c, 7, c.mmu.read(c.HL)) }],

  [0x86, (c) => { res(c, 0, memRef(c, c.HL)) }],
  [0x8E, (c) => { res(c, 1, memRef(c, c.HL)) }],
  [0x96, (c) => { res(c, 2, memRef(c, c.HL)) }],
  [0x9E, (c) => { res(c, 3, memRef(c, c.HL)) }],
  [0xA6, (c) => { res(c, 4, memRef(c, c.HL)) }],
  [0xAE, (c) => { res(c, 5, memRef(c, c.HL)) }],
  [0xB6, (c) => { res(c, 6, memRef(c, c.HL)) }],
  [0xBE, (c) => { res(c, 7, memRef(c, c.HL)) }],

  [0xC6, (c) => { set(c, 0, memRef(c, c.HL)) }],
  [0xCE, (c) => { set(c, 1, memRef(c, c.HL)) }],
  [0xD6, (c) => { set(c, 2, memRef(c, c.HL)) }],
  [0xDE, (c) => { set(c, 3, memRef(c, c.HL)) }],
  [0xE6, (c) => { set(c, 4, memRef(c, c.HL)) }],
  [0xEE, (c) => { set(c, 5, memRef(c, c.HL)) }],
  [0xF6, (c) => { set(c, 6, memRef(c, c.HL)) }],
  [0xFE, (c) => { set(c, 7, memRef(c, c.HL)) }]
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
