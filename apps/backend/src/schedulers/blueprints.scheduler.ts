import { getLogger } from 'logger'
import * as cron from 'node-cron'

import { RepositoryLocator } from '../db/repositoryLocator'

const logger = getLogger('backend')

let processBlueprintsSchedule = process.env['NODECRON_PROCESS_BLUEPRINTS']
if (!processBlueprintsSchedule) {
    processBlueprintsSchedule = '7 3 * * *'
    logger.warn(
        `Environment variable NODECRON_PROCESS_BLUEPRINTS is not set. Will fall back to the cron expression '${processBlueprintsSchedule}'.`
    )
}

export const PROCESS_BLUEPRINTS_TASK: cron.ScheduledTask = cron.schedule(
    processBlueprintsSchedule,
    async () => {
        try {
            // Process blueprints (basically insert into db if blueprint transaction is due, or skip otherwise)
            await RepositoryLocator.getRepository().processBlueprints()
            // Send success notification
        } catch (error) {
            // Log error
            // Send failure notification
        }
    },
    {
        scheduled: false,
        name: 'Task: insert transactions from blueprints',
    }
)
