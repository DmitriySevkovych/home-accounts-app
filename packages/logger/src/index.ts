/*
 For helpful information on Pino cf. 
    - https://github.com/pinojs/pino
    - https://github.com/pinojs/pino-http
    - https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
    - https://levelup.gitconnected.com/better-logging-in-next-js-apps-with-pino-f973de4dd8dd
*/
import { IncomingMessage, ServerResponse } from 'http'
import pino, { Logger } from 'pino'
import pinoHttp, { HttpLogger } from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

export type { Logger } from 'pino'

export type LoggerName = 'backend' | 'setup' | 'db' | 'frontend'

export function getLogger(name: LoggerName): Logger {
    return pino({
        name,
        level: process.env.LOG_LEVEL || 'debug',
    })
}

export function getHttpLogger(name: LoggerName): HttpLogger {
    const logger = getLogger(name)
    return pinoHttp({
        logger: logger,

        // Define a custom request id function
        genReqId: function (req: IncomingMessage, res: ServerResponse) {
            const existingID = req.id ?? req.headers['x-request-id']
            if (existingID) return existingID
            const id = uuidv4()
            res.setHeader('X-Request-Id', id)
            return id
        },

        useLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    })
}
