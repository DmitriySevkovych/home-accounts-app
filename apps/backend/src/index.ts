import { getLogger } from 'logger'

import { createServer } from './server'

const port = process.env.PORT || 5001
const logger = getLogger('backend')

createServer()
    .then((server) => {
        server.listen(port, () => {
            logger.info(`api running on ${port}`)
        })
    })
    .catch((err) => {
        logger.fatal(err)
    })
