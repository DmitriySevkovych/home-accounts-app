import https from 'https'
import { getLogger } from 'logger'

import { createSecureServer } from './server'
import { RepositoryLocator } from './db/repositoryLocator'

const logger = getLogger('backend')

const { PORT, API_BASE_URL } = process.env

if (!PORT || !API_BASE_URL) {
    logger.error(
        'The PORT or API_BASE_URL environment variable is not set! Will terminate the application.'
    )
    process.exit(1)
}

createSecureServer()
    .then((server) => {
        server.listen(PORT, () => {
            logger.info(
                `Server up and running on port ${PORT}. The api base url is set to '${API_BASE_URL}'`
            )
        })

        handleSignal(server, 'SIGINT')
        handleSignal(server, 'SIGTERM')
    })
    .catch((err) => {
        logger.fatal(err)
    })

const handleSignal = (server: https.Server, signal: string) => {
    process.on(signal, async () => {
        logger.info(`Signal ${signal} received. Will terminate.`)
        server.close(() => {
            logger.info('HTTPS server closed.')
        })
        await RepositoryLocator.closeRepository()
        logger.info('Database connection closed.')
        process.exit(0)
    })
    logger.debug(`Registered a listener for signal ${signal}.`)
}
