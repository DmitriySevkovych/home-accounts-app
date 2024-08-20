import https from 'https'
import { getLogger } from 'logger'

import { RepositoryLocator } from './db/repositoryLocator'
import { MAIL_TRANSPORTER } from './mails/send'
import { PROCESS_BLUEPRINTS_TASK } from './schedulers/blueprints.scheduler'
import { createSecureServer } from './server'

const logger = getLogger()

const { PORT, API_BASE_URL } = process.env
const SCHEDULER_DISABLED = process.env.SCHEDULER_DISABLED === 'true'
const MAIL_DISABLED = process.env.MAIL_DISABLED === 'true'

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

        if (SCHEDULER_DISABLED) {
            logger.warn(
                'Scheduler is disabled. If you want to enable it, adjust the configuration.'
            )
        } else {
            PROCESS_BLUEPRINTS_TASK.start()
        }

        if (MAIL_DISABLED) {
            logger.warn(
                'Sending notification mails is disabled. If you want to enable it, adjust the configuration.'
            )
        }

        handleSignal(server, 'SIGINT')
        handleSignal(server, 'SIGTERM')
    })
    .catch((err) => {
        logger.fatal(err)
        if (!SCHEDULER_DISABLED) PROCESS_BLUEPRINTS_TASK.stop()
        if (!MAIL_DISABLED) MAIL_TRANSPORTER.close()
        process.exit(1)
    })

const handleSignal = (server: https.Server, signal: string) => {
    process.on(signal, async () => {
        logger.info(`Signal ${signal} received. Will terminate.`)
        server.close(() => {
            logger.info('HTTPS server closed.')
        })
        // Tear down singletons
        if (!SCHEDULER_DISABLED) PROCESS_BLUEPRINTS_TASK.stop()
        if (!MAIL_DISABLED) MAIL_TRANSPORTER.close()
        await RepositoryLocator.closeRepository()

        logger.info('Database connection closed.')
        process.exit(0)
    })
    logger.debug(`Registered a listener for signal ${signal}.`)
}
