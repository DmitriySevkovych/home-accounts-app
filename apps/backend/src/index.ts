import { getLogger } from 'logger'

import { PostgresRepository } from './db/v1/postgresRepository'
import { createServer } from './server'
import { RepositoryLocator } from './db/repositoryLocator'

const port = process.env.PORT || 5001
const logger = getLogger('backend')

const repository = new PostgresRepository()
repository
    .initialize()
    .then(() => {
        RepositoryLocator.setRepository(repository)
        const server = createServer()
        server.listen(port, () => {
            logger.info(`api running on ${port}`)
        })
    })
    .catch((err) => {
        logger.fatal(err)
    })
