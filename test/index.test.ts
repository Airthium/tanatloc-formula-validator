import { parse } from '../src'

describe('parse', () => {
  test('simple', () => {
    parse('1 + 2')
  })

  test('sin', () => {
    try {
      parse('1 + 2 * sin(2.*pi*t) + (1 * (x <= 0.5)')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Separator mismatch')
    }
  })
})
