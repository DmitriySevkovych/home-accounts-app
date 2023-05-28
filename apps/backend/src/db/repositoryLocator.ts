import { Repository } from './repository'
import { StubbedRepository } from './stubs/stubbedRepository'
import { PostgresRepository } from './v1/postgresRepository'

export class RepositoryLocator {
    private static INSTANCE: Repository | undefined

    static getRepository = async (): Promise<Repository> => {
        if (!RepositoryLocator.INSTANCE) {
            if (process.env.NODE_ENV === 'test') {
                this.INSTANCE = new StubbedRepository()
            } else {
                const repository = new PostgresRepository()
                await repository.initialize()
                this.INSTANCE = repository
            }
        }
        return RepositoryLocator.INSTANCE!
    }

    static setRepository = (repository: Repository): void => {
        RepositoryLocator.INSTANCE = repository
    }

    static closeRepository = async (): Promise<void> => {
        await RepositoryLocator.INSTANCE?.close()
        RepositoryLocator.INSTANCE = undefined
    }
}
