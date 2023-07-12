const mockReadFileSync = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFileSync()
}))

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

const content = `
the keywords
real 1 1
the types
--test
operator test
( test
[ test
type 1 1
type 1 1
`

describe('tools/dump', () => {
  test('call', async () => {
    mockReadFileSync.mockImplementation(() => content)

    await import('../../tools/getList')
  })
})
