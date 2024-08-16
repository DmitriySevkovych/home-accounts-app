import { getLogger } from './index'

describe('Logger', () => {
    it('Silly test', () => {
        const logger = getLogger('setup')
        expect(logger).toBeDefined()
    })
})
