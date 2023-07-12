import { parse } from '../src'
import { FreeFEMSeparators } from '../src/defs'

describe('parse', () => {
  test('simple', () => {
    parse('1 + 2')
  })

  test('separator', () => {
    parse('1 + 2. * sin(2. * pi)')
    try {
      parse('1 + 2. * sin(2. * pi')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe(
        'Separator mismatch, check ' +
          FreeFEMSeparators.map((separator) => separator.join(' .. ')).join(
            ', '
          )
      )
    }

    parse("[1., 2.]' * [3., 4.]")
    try {
      parse("[1., 2.]' * [3., 4.")
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe(
        'Separator mismatch, check ' +
          FreeFEMSeparators.map((separator) => separator.join(' .. ')).join(
            ', '
          )
      )
    }
  })

  test('keywords', () => {
    parse('sin(2. * pi * x)')

    parse('sin(2. * pi * t + phi)', { additionalKeywords: ['t', 'phi'] })

    try {
      parse('sin(2. * pi * t + phi)')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Wrong keyword "t"')
    }
  })

  test('operators', () => {
    parse('1 + 2 * 5 - 1')

    parse('-5.')

    try {
      parse('--5')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Wrong operator before 5')
    }

    try {
      parse('-5 + * 6')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Wrong operator between 5 and 6')
    }

    try {
      parse('6+')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Wrong operator after 6')
    }

    try {
      parse('+')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Wrong operator')
    }
  })
})
