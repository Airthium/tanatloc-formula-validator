import { Options } from '../index.d'

import {
  FreeFEMOperators,
  FreeFEMSeparators,
  FreeFEMTypes,
  FreeFemKeywords
} from './defs'

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
  const operators = [...FreeFEMOperators].sort((a, b) => b.length - a.length)
  const separators = [...FreeFEMSeparators]
    .sort((a, b) => b.length - a.length)
    .flat()
  const keywords = [...FreeFemKeywords].sort((a, b) => b.length - a.length)
  const types = [...FreeFEMTypes].sort((a, b) => b.length - a.length)

  const additionalKeywords = [...(options?.additionalKeywords ?? [])].sort(
    (a, b) => b.length - a.length
  )

  // Split
  let left = formula
  operators.forEach((operator) => (left = left.split(operator).join(' ')))
  separators.forEach((separator) => (left = left.split(separator).join(' ')))
  keywords.forEach((keyword) => (left = left.split(keyword).join(' ')))
  types.forEach((type) => (left = left.split(type).join(' ')))

  additionalKeywords.forEach(
    (additionalKeyword) => (left = left.split(additionalKeyword).join(' '))
  )

  // Check lefts are only number
  const lefts = left.split(' ').filter((l) => l)
  for (const left of lefts) {
    if (left === "'") continue
    const parsed = Number(left)
    if (isNaN(parsed)) throw new Error('Wrong keyword "' + left + '"')
  }
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
  console.log(formula)
  // Check separators (parenthesis, array, blocks, string)
  checkSeparators(formula)

  // Check keywords
  checkKeywords(formula, options)

  // Check operators
  checkOperators(formula)
}
