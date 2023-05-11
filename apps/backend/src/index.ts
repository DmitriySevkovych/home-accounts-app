import { createServer } from './server'
import { getLogger } from 'logger'

const port = process.env.PORT || 5001
const server = createServer()

const logger = getLogger('backend')

server.listen(port, () => {
    logger.info(`api running on ${port}`)
})
