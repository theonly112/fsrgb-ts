export interface Display {
  draw: (framebuffer: Framebuffer) => void
  createFramebuffer: () => Framebuffer
}

export interface Framebuffer {
  setPixel: (x: number, y: number, c: Color) => void
}

export interface Color {
  r: number
  g: number
  b: number
}
