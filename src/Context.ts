import { Expr, Input, InputSimple, isExpr, Signal, Signaling, SimpleType, Tag } from './Signal'
import SpaceManager from './SpaceManager'
import EngineError from './errors/EngineError'

export default class Context {
  static readValue (value: SimpleType | Expr): SimpleType {
    if (isExpr(value)) {
      return value()
    }
    return value
  }

  private input: Input = null
  out: Record<string, any> = {}
  sm: SpaceManager
  up: Context | null = null
  data = new Map<string, any>()

  constructor (
    public tag: Tag,
    sm: SpaceManager | null,
    up: Context | null = null
  ) {
    if (up) {
      this.sm = up.sm
      this.up = up
    } else {
      if (!sm) {
        throw new Error()
      }
      this.sm = sm
    }
  }

  public signaling: Signaling = (tag, input = null, scope = null) => {
    let signal: Signal | null
    if (typeof tag === 'string') {
      const factory = this.sm.load(tag)
      signal = factory(tag)
    } else {
      signal = tag
    }

    if (!signal || !signal._fn) {
      throw new EngineError(`Could not found valid signal for tag ${tag}`)
    }

    const ctx = new Context(tag, this.sm, this)
    ctx.setInput(input)
    if (!signal._lazy && scope) {
      scope(ctx.signaling)
    }

    return signal._fn(ctx, scope)
  }

  public getInput(key?: null): InputSimple;
  public getInput (key: string): any
  public getInput (key: null | string | undefined): any {
    if (!this.input) {
      this.input = {}
    }

    if (key == null) {
      const ret: InputSimple = {}
      for (const p in this.input) {
        if (Object.prototype.hasOwnProperty.call(this.input, p)) {
          ret[p] = Context.readValue(this.input[p])
        }
      }
      return ret
    } else {
      return Context.readValue(this.input[key])
    }
  }

  public updateInput (input: Input) {
    if (!this.input) {
      this.input = {}
    }
    Object.assign(this.input, input)
  }

  public setInput (input: Input) {
    this.input = input
  }

  public getData<T> (key: string): T {
    return this.data.get(key)
  }

  public setData<T> (key: string, value: T) {
    this.data.set(key, value)
  }

  public deleteData (key: string) {
    return this.data.delete(key)
  }

  public hasData (key: string) {
    return this.data.has(key)
  }
}

export interface SubContext extends Context {
  up: Context
}
