import { Repository } from './repository'
import { StubbedRepository } from './stubs/stubbedRepository'
import { PostgresRepository } from './v1/postgresRepository'

export class RepositoryLocator {
    private static INSTANCE: Repository | undefined

    static getRepository = (): Repository => {
        if (!RepositoryLocator.INSTANCE) {
            if (process.env.NODE_ENV === 'test') {
                this.INSTANCE = new StubbedRepository()
            } else {
                this.INSTANCE = new PostgresRepository()
            }
        }
        return RepositoryLocator.INSTANCE!
    }

    static setRepository = (repository: Repository): void => {
        RepositoryLocator.INSTANCE = repository
    }

    static closeRepository = async (callback?: () => void): Promise<void> => {
        await RepositoryLocator.INSTANCE?.close()
        RepositoryLocator.INSTANCE = undefined
        if (callback) callback()
    }
}
