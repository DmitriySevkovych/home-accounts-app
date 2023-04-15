/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
*/
const dockerCompose = require('docker-compose')
const path = require('path')

module.exports = async () => {
    try {
        console.log('Global setup for integration tests')
        console.log('Running "docker-compose up" for integration tests')
        const upResult = await dockerCompose.upAll({
            cwd: path.join(__dirname),
            config: 'docker-compose.test.yml',
        })

        if (upResult.err) {
            console.error(upResult.err)
        }
        console.log(upResult.out)
    } catch (err) {
        console.error(err)
    }

    // TODO execute SQL statements: create database, create tables and insert data
    console.log(
        'Execute SQL statements: create test database, create tables and insert data'
    )
}
