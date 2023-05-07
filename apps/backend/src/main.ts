import { createServer } from './server'
import { getLogger } from 'utilities/logging'

const port = process.env.PORT || 5001
const server = createServer()

server.listen(port, () => {
    const logger = getLogger('backend')
    logger.info(`api running on ${port}`)
})
