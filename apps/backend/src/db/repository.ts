import 'reflect-metadata'

export interface Repository {
    close: () => Promise<void>
    ping: () => boolean
}
