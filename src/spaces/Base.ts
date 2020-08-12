import { Signal } from '../Signal'
import { Space } from '../SpaceManager'
import { requireScope, requireSubContext } from '../utils/helpers'

const signalMap: Record<string, Signal> = {
  root: {
    _fn: () => null
  },
  in: {
    _fn: (ctx) => {
      if (requireSubContext(ctx)) {
        ctx.up.getInput()
      }
    }
  },
  out: {
    _fn (ctx) {
      if (requireSubContext(ctx)) {
        const out = Object.assign({}, ctx.out, ctx.getInput())
        delete out._as
        ctx.up.out = out
        return out
      }
    }
  },
  if: {
    _fn: (ctx) => ctx.out
  },
  then: {
    _lazy: true,
    _fn (ctx, scope) {
      if (requireSubContext(ctx) && requireScope(ctx, scope)) {
        if (ctx.up.getInput('match')) {
          scope(ctx.up.signaling)
        }
      }
    }
  },
  else: {
    _lazy: true,
    _fn (ctx, scope) {
      if (requireSubContext(ctx) && requireScope(ctx, scope)) {
        if (!ctx.up.getInput('match')) {
          scope(ctx.up.signaling)
        }
      }
    }
  },
  elseIf: {
    _lazy: true
  },
  prop: {
    _fn (ctx) {
      if (requireSubContext(ctx)) {
        ctx.up.updateInput(ctx.out)
        ctx.up.updateInput(ctx.getInput())
      }
    }
  },
  block: {
    _lazy: true,
    _fn (ctx) {
      ctx.getInput('_')
    }
  },
  const: {
    _fn (ctx) {
      return ctx.getInput()
    }
  }
}

function factory (tag: string) {
  const init = signalMap[tag]
  return init ? new Signal(signalMap[tag]) : null
}

const base: Space = {
  provides: Object.keys(signalMap),
  resolver () {
    return factory
  }
}

export default base
