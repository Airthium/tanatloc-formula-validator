// Formula validation
// https://github.com/Airthium/old__tanatloc-client/blob/8c238a4e8556c4e123e1c5369c7bc6d7d2c3b81c/src/components/project/formula/Formula.js

import { Options } from '../index.d'

import { freefemDefs } from './defs'

export const parse = (formula: string, options?: Options): boolean => {
  const numbers = /^[0-9e.,]+$/
  const operators = /[\^+\-*/<>,\s]/

  // Remove spaces
  const cleanValue = formula.replace(/\s/gi, '')

  // Count parenthesis
  const openMatch = cleanValue.match(/\(/g)
  const closeMatch = cleanValue.match(/\)/g)
  const openNumber = openMatch?.length ?? 0
  const closeNumber = closeMatch?.length ?? 0

  console.log(openNumber)
  console.log(closeNumber)

  // Split by operators (or space)
  const parts = cleanValue.split(operators)

  // minus is allowed at the begenning
  if (cleanValue.startsWith('-')) parts.shift()

  // Remove parenthesis
  const parenthesis = /[()]/
  const partsLength = parts.length
  for (let i = 0; i < partsLength; ++i) {
    const part = parts[i]
    if (part === '')
      // This is a non authorized char from above
      continue

    const subParts = part.split(parenthesis)
    subParts.forEach((subPart) => {
      if (subPart !== '') parts.push(subPart)
    })

    parts[i] = '1' // Set a number, so it is valid
  }

  // Check if it is a number or if it is authorized
  let isAuthorized = openNumber === closeNumber
  parts.forEach((part) => {
    isAuthorized =
      isAuthorized &&
      (numbers.test(part) ||
        freefemDefs.includes(part) ||
        (options?.additionalKeywords?.includes(part) ?? true))
  })

  return isAuthorized
}
