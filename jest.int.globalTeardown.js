/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
*/
const isCI = require('is-ci')
const dockerCompose = require('docker-compose')

module.exports = async () => {
    console.log('Global teadrown for integration tests')

    if (isCI) {
        dockerCompose.down()
        console.log('Running "docker-compose down" for integration tests')
    } else {
        console.log(
            'SKIPPING "docker-compose down" command because not in CI environment! Docker containers will remain running'
        )
    }

    // TODO execute SQL statements: drop database
    console.log('Execute SQL statements: drop test database')
}
