import { DataSource } from 'typeorm'
import { getLogger, Logger } from 'logger'

import { Repository } from '../../repository'

export class PostgresRepository implements Repository {
    logger: Logger
    db: DataSource

    constructor() {
        this.logger = getLogger('db')
        this.db = new DataSource({
            type: 'postgres',
            host: process.env['POSTGRES_CONTAINER_HOST'],
            port: Number(process.env['POSTGRES_CONTAINER_PORT']),
            username: process.env['POSTGRES_USER'],
            password: process.env['POSTGRES_PASSWORD'],
            database: process.env['POSTGRES_DB'],
            synchronize: process.env.NODE_ENV !== 'production',
            // logging: true,
            // entities: [Post, Category],
            // subscribers: [],
            // migrations: [],
        })
    }

    initialize = async (): Promise<void> => {
        try {
            await this.db.initialize()
            this.logger.debug(
                `Successfully initialized a ${process.env.NODE_ENV} database connection`
            )
        } catch (err) {
            this.logger.error(
                err,
                `Could not initialize a ${process.env.NODE_ENV} database connection`
            )
            throw err
        }
    }

    close = async (): Promise<void> => {
        this.logger.debug('Closing the database connection')
        await this.db.destroy()
        this.logger.debug('Successfully closed the database connection')
    }

    ping = (): boolean => {
        return this.db.isInitialized
    }
}
