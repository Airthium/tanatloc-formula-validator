import { Options } from '../index.d'

import {
  FreeFEMOperators,
  FreeFEMSeparators,
  FreeFEMTypes,
  FreeFemKeywords
} from './defs.js'

/**
 * Check separators
 * @param formula Formula
 */
const checkSeparators = (formula: string): void => {
  // Map
  const map = new Map()
  FreeFEMSeparators.forEach((separator) => map.set(separator[0], separator[1]))

  // Stack
  const stack: string[] = []
  for (const char of formula) {
    const currentStack = stack[stack.length - 1]
    if (map.has(char)) {
      stack.push(char)
    } else if (map.get(currentStack) === char) {
      stack.pop()
    } else {
      continue
    }
  }

  // Check stack
  if (stack.length !== 0)
    throw new Error(
      'Separator mismatch, check ' +
        FreeFEMSeparators.map((separator) => separator.join(' .. ')).join(', ')
    )
}

/**
 * Check keywords
 * @param formula Formula
 * @param options Options
 */
const checkKeywords = (formula: string, options?: Options): void => {
  // Sort
  const regexPattern = [
    ...FreeFEMOperators,
    ...FreeFEMSeparators.flat(),
    ...FreeFemKeywords,
    ...FreeFEMTypes,
    ...(options?.additionalKeywords ?? [])
  ]
    .sort((a, b) => b.length - a.length)
    .map((token) => token.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|')

  const regex = new RegExp(regexPattern, 'g')

  // Split
  let left = formula.replace(regex, ' ')

  // Check lefts are only numbers or spaces.
  left.split(' ').forEach((token) => {
    if (token === "'") return
    if (token && isNaN(Number(token))) {
      throw new Error('Wrong keyword "' + token + '"')
    }
  })
}

/**
 * Check operators
 * @param formula Formula
 */
const checkOperators = (formula: string): void => {
  // Sort
  const operators = [...FreeFEMOperators].sort((a, b) => b.length - a.length)

  // Split
  let left = formula.replace(/\s/gi, '')
  operators.forEach((operator) => (left = left.split(operator).join(' ')))
  const lefts = left.split(' ')

  // Minus at start
  if (formula.startsWith('-') && !formula.startsWith('--')) lefts.shift()

  // Check no empty string
  for (let i = 0; i < lefts.length; ++i) {
    const left = lefts[i]
    if (left === '') {
      if (lefts[i - 1] && lefts[i + 1]) {
        throw new Error(
          'Wrong operator between ' + lefts[i - 1] + ' and ' + lefts[i + 1]
        )
      } else if (lefts[i - 1]) {
        throw new Error('Wrong operator after ' + lefts[i - 1])
      } else if (lefts[i + 1]) {
        throw new Error('Wrong operator before ' + lefts[i + 1])
      } else {
        throw new Error('Wrong operator')
      }
    }
  }
}

export const parse = (formula: string, options?: Options): void => {
  // Check separators (parenthesis, array, blocks, string)
  checkSeparators(formula)

  // Check keywords
  checkKeywords(formula, options)

  // Check operators
  checkOperators(formula)
}
