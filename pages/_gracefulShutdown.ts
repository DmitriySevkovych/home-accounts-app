// import * as keypress from 'keypress'

import { RepositoryLocator } from '../db/repositoryLocator'
import { LoggerName, getLogger } from '../logging/log-util'

const signals = ['SIGTERM', 'SIGINT']

export const addShutdownSignalHandlers = (loggerName: LoggerName) => {
    const logger = getLogger(loggerName)

    // Windows workaround: https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
    // if (process.platform === 'win32') {
    //     logger.debug('Adding keypress handler for Ctrl-C on Windows')
    //     keypress(process.stdin)
    //     process.stdin.resume()
    //     process.stdin.setRawMode(true)
    //     process.stdin.setEncoding('utf8')
    //     process.stdin.on('keypress', (char, key) => {
    //         if (key && key.ctrl && key.name === 'c') {
    //             logger.debug(
    //                 'Received a Ctrl-C on Windows. Will emit SIGINT for further processing'
    //             )
    //             process.emit('SIGINT', 'SIGINT')
    //         }
    //     })
    // }

    signals.forEach((signal) => {
        logger.debug(`Adding signal handler for ${signal}`)
        process.on(signal, async () => {
            logger.info(`Received ${signal}`)

            await RepositoryLocator.closeRepository()

            const timeout = Number(process.env.GRACEFUL_SHUTDOWN_TIMEOUT)
            setTimeout(
                (...args) => {
                    logger.warn(...args)
                    process.exit(1)
                },
                timeout,
                `Signal ${signal} could not be processed correctly after ${timeout} milliseconds. Exiting hard.`
            )
            logger.info(`Received ${signal}, end`)
        })
    })
}
