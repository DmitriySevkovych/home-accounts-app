import { getLogger } from 'logger'

import { createServer } from './server'

const logger = getLogger('backend')

const { PORT, API_BASE_URL } = process.env

if (!PORT || !API_BASE_URL) {
    logger.error(
        'The PORT or API_BASE_URL environment variable is not set! Will terminate the application.'
    )
    process.exit(1)
}

createServer()
    .then((server) => {
        server.listen(PORT, () => {
            logger.info(
                `Server up and running on port ${PORT}. The api base url is set to '${API_BASE_URL}'`
            )
        })
    })
    .catch((err) => {
        logger.fatal(err)
    })
