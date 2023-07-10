import { parse } from '../src'

describe('parse', () => {
  test('simple', () => {
    const res = parse('1 + 2')
    expect(res).toBe(true)
  })

  test('sin', () => {
    const res = parse('1 + 2 * sin(2.*pi*t) + (1 * (x <= 0.5)')
    expect(res).toBe(false) //missing parenthesis
  })
})
