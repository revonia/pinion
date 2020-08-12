/* eslint-env jest */

import { Scope, Engine } from '../'

function genRoot (value: number): Scope {
  return (s) => {
    const const$ = s('const', { value })

    const result$ = s('switch', null, (s) => {
      s('prop', { match: () => true })

      s('case', { match: () => const$.value === 1 }, (s) => {
        s('out', { value: 'a' })
      })

      s('caseLazy', null, (s) => {
        s('prop', null, (s) => {
          s('out', { match: () => const$.value === 2 })
        })

        s('then', null, (s) => {
          s('out', { value: 'b' })
        })
      })

      s('caseDefault', null, (s) => {
        s('out', { value: 'default' })
      })
    })

    s('out', { result: () => result$.value })
  }
}

test('basic condition test', () => {
  const dataset: Array<[number, string]> = [
    [1, 'a'],
    [2, 'b'],
    [3, 'default']
  ]

  dataset.forEach(([v, out]) => {
    const root = genRoot(v)
    const engine = new Engine()
    engine.loadRootScope(root)
    const output = engine.product()
    expect(output.value).toBe(out)
  })
})
