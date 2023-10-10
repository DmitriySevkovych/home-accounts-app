import { hostname } from 'os'

type SystemInfo = {
    environment: string
    host: string
    port: string
    db: string
    branch: string
    commit: string
}

export const getInfo = (): Partial<SystemInfo> => {
    return {
        environment: process.env['APP_ENV'],
        host: hostname(),
        port: process.env.PORT,
        db: process.env['PGDATABASE'],
        branch: process.env['GIT_BRANCH'],
        commit: process.env['GIT_COMMIT'],
    }
}
