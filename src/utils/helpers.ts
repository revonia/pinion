import Context, { SubContext } from '../Context'
import PinionSignalError from '../errors/SignalError'
import { Scope } from '../Signal'

export function requireSubContext (ctx: Context): ctx is SubContext {
  if (!ctx.up) {
    throw new PinionSignalError(ctx.tag, 'does not have up')
  }
  return true
}

export function requireScope (ctx: Context, scope: unknown): scope is Scope {
  if (!scope) {
    throw new PinionSignalError(ctx.tag, 'does not have scope')
  }
  return true
}

export function randomStr (): string {
  return Math.random().toString(36).substring(6)
}
