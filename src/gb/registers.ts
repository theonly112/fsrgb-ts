import { toHex } from './helpers'

export class Register {
  private value: number = 0
  constructor (private readonly name: string) {

  }

  get_low (): number {
    return this.value & 255
  }

  get_high (): number {
    return this.value >> 8
  }

  get_value (): number {
    return this.value
  }

  set_low (v: number): void {
    this.value = this.value & 0xff00 | v & 0xff
  }

  set_high (v: number): void {
    this.value = this.value & 0x00FF | (v << 8 & 0xff00)
  }

  set_vaule (v: number): void {
    this.value = v & 0xffff
  }
}

type Setter = (value: number) => void
type Getter = () => number

export class Registers {
  private readonly setters: Record<string, Setter> = {}
  private readonly getters: Record<string, Getter> = {}
  private readonly regs: Register[] = []

  constructor () {
    this.init_reg(AF)
    this.init_reg(BC)
    this.init_reg(DE)
    this.init_reg(HL)
    this.init_reg(SP, false)
    this.init_reg(PC, false)
  }

  init_reg (name: string, split: boolean = true): void {
    const r = new Register(name)
    this.getters[name] = Register.prototype.get_value.bind(r)
    if (split) {
      this.getters[name[0]] = Register.prototype.get_high.bind(r)
      this.getters[name[1]] = Register.prototype.get_low.bind(r)
    }
    this.setters[name] = Register.prototype.set_vaule.bind(r)
    if (split) {
      this.setters[name[0]] = Register.prototype.set_high.bind(r)
      this.setters[name[1]] = Register.prototype.set_low.bind(r)
    }
    this.regs.push(r)
  }

  get (name: string): number {
    return this.getters[name]()
  }

  set (name: string, value: number): void {
    this.setters[name](value)
  }

  to_string (): string {
    // $"PC: {sut.Cpu.R.PC:X4} SP: {sut.Cpu.R.SP:X4} AF: {sut.Cpu.R.AF:X4} BC: {sut.Cpu.R.BC:X4} DE: {sut.Cpu.R.DE:X4} HL: {sut.Cpu.R.HL:X4} INS: {sut.Mmu.ReadByte(sut.Cpu.R.PC):X2}"
    return `${PC}: ${toHex(this.get(PC), 4)} ` +
    `SP: ${toHex(this.get(SP), 4)} ` +
    `AF: ${toHex(this.get(AF), 4)} ` +
    `BC: ${toHex(this.get(BC), 4)} ` +
    `DE: ${toHex(this.get(DE), 4)} ` +
    `HL: ${toHex(this.get(HL), 4)} `
  }

  clear_flag (flag: CpuFlags): void {
    let value = this.get(F)
    value &= ~(flag as number)
    this.set(F, value)
  }

  set_flag (flag: CpuFlags): void {
    let value = this.get(F)
    value |= (flag as number)
    this.set(F, value)
  }

  check (flag: CpuFlags): boolean {
    const value = this.get(F)
    return (value & (flag as number)) > 0
  }
}

export enum CpuFlags {
  Carry = 1 << 4,
  HalfCarry = 1 << 5,
  Negative = 1 << 6,
  Zero = 1 << 7,
}

export const AF: string = 'AF'
export const A: string = 'A'
export const F: string = 'F'
export const BC: string = 'BC'
export const B: string = 'B'
export const C: string = 'C'
export const DE: string = 'DE'
export const D: string = 'D'
export const E: string = 'E'
export const HL: string = 'HL'
export const H: string = 'H'
export const L: string = 'L'
export const SP: string = 'SP'
export const PC: string = 'PC'
