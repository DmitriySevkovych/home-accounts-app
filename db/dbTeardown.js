/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
    - https://docs.docker.com/engine/reference/commandline/compose/
*/
import isCI from 'is-ci'
import { down } from 'docker-compose'
import { join } from 'path'

export const removeDatabaseContainer = (force = false) => {
    if (isCI || force) {
        down({
            cwd: join(__dirname),
            config: ['docker-compose.db.yml'],
        })
        console.log('Running "docker-compose down"')
    } else {
        console.log(
            'SKIPPING "docker-compose down" command because not in CI environment! Docker containers will remain running'
        )
        dropDatabase()
    }
}

const dropDatabase = () => {
    // TODO execute SQL statements: drop database
    console.log('Execute SQL statements: drop test database')
}
