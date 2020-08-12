import { Tag } from '../Signal'

export default class PinionSignalError extends Error {
  constructor (tag: Tag, message: string) {
    super(`[Tag: ${tag}]: ${message}`)
    this.name = 'PinionSignalError'
  }
}
