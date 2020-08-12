import { Signal } from './Signal'
import EngineError from './errors/EngineError'

type SignalFactory = (tag: string) => Signal | null
type SpaceResolver = (tag: string) => SignalFactory | null

export interface Space {
  provides: string[]
  resolver: SpaceResolver
}

export default class SpaceManager {
  private factoryMap = new Map<string, SignalFactory>()
  private resolverMap = new Map<string, SpaceResolver>()

  load(tag: string) {
    let factory = this.factoryMap.get(tag) || null
    if (!factory) {
      const resolver = this.resolverMap.get(tag)
      if (resolver) {
        factory = resolver(tag)
        if (factory) {
          this.factoryMap.set(tag, factory)
        }
      }
    }

    if (!factory) {
      throw new EngineError(`Can not found tag '${tag}'`)
    }

    return factory
  }

  addSpace(space: Space) {
    for (const tag of space.provides) {
      this.resolverMap.set(tag, space.resolver)
    }
  }
}
