import Jimp from 'jimp'
import { type Color, type Display, type Framebuffer } from './display'

class JimpFrameBuffer implements Framebuffer {
  buff: Jimp
  frame: number = 0
  constructor () {
    this.buff = new Jimp(160, 144)
  }

  setPixel (x: number, y: number, c: Color): void {
    this.buff.setPixelColor(Jimp.rgbaToInt(c.r, c.g, c.b, 255), x, y)
  }

  save (): void {
    this.buff.write(`frames/test${this.frame++}.png`)
  }
}

export class PngDisplay implements Display {
  createFramebuffer (): Framebuffer {
    return new JimpFrameBuffer()
  }

  draw (framebuffer: Framebuffer): void {
    const buff = framebuffer as JimpFrameBuffer
    if (buff != null) {
      buff.save()
    }
  }
}
