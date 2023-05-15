import { DataSource } from 'typeorm'

const dataSource = new DataSource({
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

export default dataSource
