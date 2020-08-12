import Context from './Context'

export type SimpleType = string | number | null | undefined | symbol | boolean | Record<string, unknown>
export type Expr = () => SimpleType

export function isExpr (value: any): value is Expr {
  return typeof value === 'function'
}

export type Input = {
  _as?: string
  [key: string]: SimpleType | Expr
} | null

export type InputSimple = {
  _as?: string
  [key: string]: SimpleType
} | null

export type Tag = Signal | string

export type Signaling = {
  (tag: Tag, input: Input | null, scope?: Scope | null): Signal
}

export type Scope = (s: Signaling) => void

type Fn = (ctx: Context, scope: Scope | null) => any
export class Signal {
  _fn?: Fn
  _as?: never
  _scope?: never
  _t?: Tag
  _lazy?: boolean
  [key: string]: any
  constructor (init: {
    _fn?: Fn
    _as?: never
    _scope?: never
    _t?: Tag
    _lazy?: boolean
    [key: string]: any
  }) {
    Object.assign(this, init)
  }

  toString () {
    return `[object PinionSignal ${typeof this._t === 'string' ? this._t : '?'}]`
  }
}
