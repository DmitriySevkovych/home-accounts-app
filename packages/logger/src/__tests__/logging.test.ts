import { getHttpLogger, getLogger } from '../index'

describe('Logger', () => {
    it('Silly test', () => {
        const httpLogger = getHttpLogger('setup')
        expect(httpLogger).toBeDefined()

        const logger = getLogger('setup')
        expect(logger).toBeDefined()
    })
})
