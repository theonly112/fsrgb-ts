import { type MemoryManagementUnit } from './mmu'

export class Timer {
  timerCnt: number = 0
  dividerCnt: number = 0

  divider = 0xFF04
  timerCounter = 0xFF05
  timerControl = 0xFF07
  interruptFlag = 0xFF0F
  timerModulo = 0xFF06

  constructor (private readonly mmu: MemoryManagementUnit) {

  }

  step (cycles: number): void {
    this.dividerCnt += cycles
    if (this.dividerCnt > 256) {
      let d = this.mmu.read(this.divider)
      d++
      this.mmu.write(this.divider, d)
      this.dividerCnt = 0
    }

    this.timerCnt += cycles
    if (this.mmu.read(this.timerCounter) === 255) {
      this.mmu.write(this.timerCounter, this.mmu.read(this.timerModulo))
      let flag = this.mmu.read(this.interruptFlag)
      flag |= 0x04
      this.mmu.write(this.interruptFlag, flag)
    } else if (this.timerEnabled()) {
      const freq = this.freq()
      if (this.timerCnt > freq) {
        this.timerCnt = 0
        const timer = this.mmu.read(this.timerCounter)
        if (timer === 255) {
          this.mmu.write(this.timerCounter, this.mmu.read(this.timerModulo))
          const flag = this.mmu.read(this.interruptFlag)
          this.mmu.write(this.interruptFlag, flag | 2)
        } else {
          this.mmu.write(this.timerCounter, timer + 1)
        }
      }
    }
  }

  timerEnabled (): boolean {
    return (this.mmu.read(this.timerControl) & 0x04) > 1
  }

  freq (): number {
    const freg = this.mmu.read(this.timerControl) & 0x03
    if (freg === 0) return 1024
    if (freg === 1) return 16
    if (freg === 2) return 64
    if (freg === 3) return 256

    return -1
  }
}
