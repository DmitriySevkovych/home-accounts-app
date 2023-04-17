/*
    For details on the docker-compose dev dependency, cf:
    - https://pdmlab.github.io/docker-compose/
*/
const isCI = require('is-ci')
const dockerCompose = require('docker-compose')
const { removeDatabaseContainer } = require('./db/dbTeardown')

module.exports = async () => {
    console.log('Global teardown for integration tests')

    removeDatabaseContainer()
}
