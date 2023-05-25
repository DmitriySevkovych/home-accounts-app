import { Repository } from './repository'
import { PostgresRepository } from './v1/postgresRepository'

export class RepositoryLocator {
    private static INSTANCE: Repository | undefined

    static getRepository = async (): Promise<Repository> => {
        if (!RepositoryLocator.INSTANCE) {
            const repository = new PostgresRepository()
            await repository.initialize()
            this.INSTANCE = repository
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
