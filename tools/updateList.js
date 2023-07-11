import fs from 'fs'
import { execSync } from 'child_process'

const keywordsSeparator = 'the keywords'
const typesSeparator = 'the types'

/**
 * Run FreeFEM dump table
 * @param {string} out Output
 */
const runFreeFEMDumpTable = (out) => {
  execSync('FreeFem++ -ns tools/dump.edp -o ' + out)
}

/**
 * Get dump table
 * @param {string} out Output
 * @returns Dump table
 */
const getDumpTable = (out) => {
  const content = fs.readFileSync(out)
  return content.toString()
}

/**
 * Get keywords
 * @param {string} dump Dump
 * @returns Keywords
 */
const getKeywords = (dump) => {
  const lines = dump.split('\n')

  const keywords = []
  let start = false
  for (const dirtyLine of lines) {
    const line = dirtyLine.trim()
    if (line === keywordsSeparator) {
      start = true
      continue
    }

    if (line === typesSeparator) break

    if (start) {
      const lineElements = line.split(' ')
      keywords.push(lineElements[0])
    }
  }

  return keywords
}

/**
 * Get types
 * @param {string} dump Sump
 * @returns Types
 */
const getTypes = (dump) => {
  const lines = dump.split('\n')

  const types = []
  let start = false
  for (const dirtyLine of lines) {
    const line = dirtyLine.trim()
    if (line === typesSeparator) {
      start = true
      continue
    }

    if (start) {
      if (
        !line ||
        line.startsWith('--') ||
        line.startsWith('operator') ||
        line.startsWith('(') ||
        line.startsWith('[')
      )
        continue

      const words = line.split(',')
      const type = words[0].replace('-', '').trim()
      const index = types.indexOf(type)
      if (index === -1) types.push(type)
    }
  }

  return types
}

/**
 * Main
 */
const main = () => {
  const output = 'tools/dump.log'
  runFreeFEMDumpTable(output)
  const dump = getDumpTable(output)
  const keywords = getKeywords(dump)
  const types = getTypes(dump)

  console.log(
    'export const FreeFemKeywords =',
    JSON.stringify(keywords, null, '\t')
  )
  console.log()
  console.log('export const FreeFEMTypes =', JSON.stringify(types, null, '\t'))
}

main()
