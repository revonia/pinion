import { Scope } from './Signal'
import baseSpace from './spaces/Base'
import Context from './Context'
import SpaceManager from './SpaceManager'

export default class Engine {
  constructor (
    private spaceManager: SpaceManager = new SpaceManager()
  ) {
    spaceManager.addSpace(baseSpace)
  }

  root: Scope | null = null
  public loadRootScope (root: Scope) {
    this.root = root
  }

  public product () {
    if (!this.root) {
      throw new Error()
    }
    const rootCtx = new Context('root', this.spaceManager)
    this.root(rootCtx.signaling)
    return rootCtx.out
  }
}
