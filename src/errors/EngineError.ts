export default class PinionEngineError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'PinionEngineError'
  }
}
