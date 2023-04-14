/*
 For helpful information on Pino cf. 
    - https://github.com/pinojs/pino
    - https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
    - https://levelup.gitconnected.com/better-logging-in-next-js-apps-with-pino-f973de4dd8dd
*/
import pino, { Logger } from 'pino'

export function getLogger(name: string): Logger {
    return pino({
        name,
        level: process.env.LOG_LEVEL || 'warn',
    })
}
