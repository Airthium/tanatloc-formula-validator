import type { Config } from 'jest'

const jestConfig: Config = {
  rootDir: '..',
  transformIgnorePatterns: [],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

export default jestConfig
