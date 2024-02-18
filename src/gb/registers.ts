export class Register {
  private value: number = 0

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
    this.value = this.value & 0x00FF | (v << 8 & 0xff00)
  }

  set_high (v: number): void {
    this.value = this.value & 0xff00 | v & 0xff
  }

  set_vaule (v: number): void {
    this.value = v
  }
}

type Setter = (value: number) => void
type Getter = () => number

export class Registers {
  private readonly setters: Record<string, Setter> = {}
  private readonly getters: Record<string, Getter> = {}
  regs = new Map<string, Register>()

  constructor () {
    this.regs = new Map()
    this.init_reg(AF)
    this.init_reg(BC)
    this.init_reg(DE)
    this.init_reg(HL)
    this.init_reg(SP)
    this.init_reg(PC)
  }

  init_reg (name: string): void {
    const r = new Register()
    this.regs.set(name, r)
    this.regs.set(name[0], r)
    this.regs.set(name[1], r)
    this.getters[name] = Register.prototype.get_value.bind(r)
    this.getters[name[0]] = Register.prototype.get_low.bind(r)
    this.getters[name[1]] = Register.prototype.get_high.bind(r)
    this.setters[name] = Register.prototype.set_vaule.bind(r)
    this.setters[name[0]] = Register.prototype.set_low.bind(r)
    this.setters[name[1]] = Register.prototype.set_high.bind(r)
  }

  get (name: string): number {
    return this.getters[name]()
  }

  set (name: string, value: number): void {
    this.setters[name](value)
  }
}

export const AF: string = 'AF'
export const A: string = 'A'
export const F: string = 'F'
export const BC: string = 'BC'
export const B: string = 'B'
export const C: string = 'C'
export const DE: string = 'BC'
export const D: string = 'B'
export const E: string = 'C'
export const HL: string = 'BC'
export const H: string = 'B'
export const L: string = 'C'
export const SP: string = 'SP'
export const PC: string = 'PC'
