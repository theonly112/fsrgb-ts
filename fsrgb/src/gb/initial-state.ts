interface State {
  AF: number
  BC: number
  DE: number
  HL: number
  SP: number
  PC: number
}

export const InitialState: State = {
  AF: 0x01B0,
  BC: 0x0013,
  DE: 0x00D8,
  HL: 0x014D,
  SP: 0xFFFE,
  PC: 0x0100
}
