/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
    - https://docs.docker.com/engine/reference/commandline/compose/
*/
import isCI from 'is-ci'
import { down } from 'docker-compose'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const removeDatabaseContainer = async (force = false) => {
    if (isCI || force) {
        console.log(
            'Running "docker-compose -f docker-compose.db.yml down" via JavaScript'
        )
        const downResult = await down({
            cwd: join(__dirname),
            config: ['docker-compose.db.yml'],
        })
        if (downResult.err) {
            console.error(downResult.err)
        }
        console.log(downResult.out)

        return downResult.exitCode
    }

    console.log(
        'SKIPPING "docker-compose down" command because not in CI environment! Docker containers will remain running'
    )
    dropDatabase()
    return 0
}

const dropDatabase = () => {
    // TODO execute SQL statements: drop database
    console.log('Execute SQL statements: drop test database')
}
