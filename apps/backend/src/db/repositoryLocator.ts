import { Repository } from './repository'

export class RepositoryLocator {
    private static INSTANCE: Repository | undefined

    static getRepository = (): Repository => {
        if (!RepositoryLocator.INSTANCE) {
            throw new Error(
                'The RepositoryLocator currently does not hold a repository instance. Please create and set a repository first.'
            )
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
