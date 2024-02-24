import * as fs from 'fs'

export interface Logger {
  write: (str: string) => void
}

export class FileLogger implements Logger {
  stream: fs.WriteStream
  constructor () {
    this.stream = fs.createWriteStream('log.txt')
  }

  write (str: string): void {
    this.stream.write(str)
    this.stream.write('\r\n')
  }

  close (): void {
    this.stream.close()
  }
}
