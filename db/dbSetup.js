/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
    - https://docs.docker.com/engine/reference/commandline/compose/
*/
import { upAll } from 'docker-compose'
import { join } from 'path'

export const startDatabaseContainer = async () => {
    try {
        console.log('Running "docker-compose up -f docker-compose.db.yml"')
        const upResult = await upAll({
            cwd: join(__dirname),
            config: ['docker-compose.db.yml'],
        })

        if (upResult.err) {
            console.error(upResult.err)
        }
        console.log(upResult.out)

        return upResult.exitCode
    } catch (err) {
        console.error(err)
        return -1
    }
}

export const runSqlStatements = () => {
    // TODO execute SQL statements: create database, create tables and insert data
    console.log(
        'Execute SQL statements: create test database, create tables and insert data'
    )
}
