import { getLogger } from './index'

describe('Logger', () => {
    it('Silly test', () => {
        const logger = getLogger()
        expect(logger).toBeDefined()
    })
})
