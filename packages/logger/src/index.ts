/*
 For helpful information on Winston cf. 
    - https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#configuring-transports-in-winston
    - https://stackoverflow.com/questions/53298354/winston-custom-log-levels-typescript-definitions
*/
import * as winston from 'winston'
import 'winston-daily-rotate-file'

const {
    combine,
    timestamp,
    printf,
    colorize,
    align,
    json,
    uncolorize,
    errors,
} = winston.format

export type LoggerName = 'backend' | 'setup' | 'db' | 'frontend'

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 7,
}
winston.addColors({
    ...winston.config.npm.colors,
    fatal: winston.config.npm.colors.error,
    trace: winston.config.npm.colors.silly,
})

const _getFormatForConsole = (): winston.Logform.Format => {
    const formats = [
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
        errors({ stack: true }),
    ]

    // Align console output only in development to avoid printing alignment symbols to file in production
    if (process.env.NODE_ENV === 'development') {
        formats.push(align())
    }

    return combine(...formats)
}

const _getFormatForFile = (): winston.Logform.Format => {
    return combine(uncolorize(), json())
}

const _getTransports = (): winston.transport[] => {
    const transports: winston.transport[] = [
        new winston.transports.Console({
            format: _getFormatForConsole(),
        }),
    ]

    if (process.env.NODE_ENV !== 'development') {
        transports.push(
            new winston.transports.DailyRotateFile({
                filename: 'app-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: '14d',
                format: _getFormatForFile(),
            })
        )
    }
    return transports
}

const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || 'debug',
    format: _getFormatForConsole(),
    transports: _getTransports(),
})

export function getLogger(
    _loggerName: LoggerName
): winston.Logger & Record<keyof typeof logLevels, winston.LeveledLogMethod> {
    return logger as winston.Logger &
        Record<keyof typeof logLevels, winston.LeveledLogMethod>
}
