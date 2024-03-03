import { type InstructionContext } from './instruction_context'
import { type Mmu } from '../mmu'
import { AF, A, F, BC, B, C, DE, D, E, HL, H, L, SP, PC, type Registers } from '../registers'

export class State implements InstructionContext {
  public halted: boolean = false
  constructor (public ime: boolean,
    public regs: Registers,
    public mmu: Mmu,
    public cycles: number) { }

  public get AF (): number {
    return this.regs.get(AF)
  }

  public set AF (val: number) {
    this.regs.set(AF, val)
  }

  public get A (): number {
    return this.regs.get(A)
  }

  public set A (val: number) {
    this.regs.set(A, val)
  }

  public get F (): number {
    return this.regs.get(F)
  }

  public set F (val: number) {
    this.regs.set(F, val)
  }

  public get BC (): number {
    return this.regs.get(BC)
  }

  public set BC (val: number) {
    this.regs.set(BC, val)
  }

  public get B (): number {
    return this.regs.get(B)
  }

  public set B (val: number) {
    this.regs.set(B, val)
  }

  public get C (): number {
    return this.regs.get(C)
  }

  public set C (val: number) {
    this.regs.set(C, val)
  }

  public get DE (): number {
    return this.regs.get(DE)
  }

  public set DE (val: number) {
    this.regs.set(DE, val)
  }

  public get D (): number {
    return this.regs.get(D)
  }

  public set D (val: number) {
    this.regs.set(D, val)
  }

  public get E (): number {
    return this.regs.get(E)
  }

  public set E (val: number) {
    this.regs.set(E, val)
  }

  public get HL (): number {
    return this.regs.get(HL)
  }

  public set HL (val: number) {
    this.regs.set(HL, val)
  }

  public get H (): number {
    return this.regs.get(H)
  }

  public set H (val: number) {
    this.regs.set(H, val)
  }

  public get L (): number {
    return this.regs.get(L)
  }

  public set L (val: number) {
    this.regs.set(L, val)
  }

  public get SP (): number {
    return this.regs.get(SP)
  }

  public set SP (val: number) {
    this.regs.set(SP, val)
  }

  public get PC (): number {
    return this.regs.get(PC)
  }

  public set PC (val: number) {
    this.regs.set(PC, val)
  }
}
