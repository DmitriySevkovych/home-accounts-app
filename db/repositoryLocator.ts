import { Repository } from './repository'
import { PostgresRepository } from './v1/access/postgresRepository'

export class RepositoryLocator {
    private static INSTANCE: Repository | undefined

    static getRepository = async (): Promise<Repository> => {
        if (!RepositoryLocator.INSTANCE) {
            const repository = await new PostgresRepository()
            await repository.initialize()
            RepositoryLocator.INSTANCE = repository
        }
        return RepositoryLocator.INSTANCE
    }

    static setRepository = (repository: Repository): void => {
        RepositoryLocator.INSTANCE = repository
    }

    static closeRepository = async (): Promise<void> => {
        await RepositoryLocator.INSTANCE?.close()
        RepositoryLocator.INSTANCE = undefined
    }
}
