import { hostname } from 'os'

type SystemInfo = {
    environment: string
    host: string
    port: string
    db: string
}

export const getInfo = (): Partial<SystemInfo> => {
    return {
        environment: process.env['APP_ENV'],
        host: hostname(),
        port: process.env.PORT,
        db: process.env['PGDATABASE'],
    }
}
