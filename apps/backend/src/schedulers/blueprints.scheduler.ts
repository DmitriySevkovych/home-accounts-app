import { Transaction } from 'domain-model'
import { getLogger } from 'logger'
import * as cron from 'node-cron'

import { RepositoryLocator } from '../db/repositoryLocator'
import { ProcessedBlueprintResult } from '../definitions/processes'
import { sendProcessedBlueprintResults } from '../helpers/mails'

const logger = getLogger('backend')

let processBlueprintsSchedule = process.env.NODECRON_PROCESS_BLUEPRINTS
if (!processBlueprintsSchedule) {
    processBlueprintsSchedule = '7 3 * * *'
    logger.warn(
        `Environment variable NODECRON_PROCESS_BLUEPRINTS is not set. Will fall back to the cron expression '${processBlueprintsSchedule}'.`
    )
}

export const PROCESS_BLUEPRINTS_TASK: cron.ScheduledTask = cron.schedule(
    processBlueprintsSchedule,
    async () => {
        logger.info('Start processing blueprints')

        // Process blueprints (basically insert into db if blueprint transaction is due, or skip otherwise)
        const repository = RepositoryLocator.getRepository()
        const activeBlueprints = await repository.getActiveBlueprints()

        const results: ProcessedBlueprintResult[] = []
        for (let i = 0; i < activeBlueprints.length; i++) {
            const blueprint = activeBlueprints[i]
            try {
                // Perform transaction inserts for every passed dueDate since the last uptade of the blueprint
                for (const dueDate of blueprint.getDatesWhenTransactionIsDue()) {
                    // TODO wrap in database transaction?
                    await repository.createTransaction({
                        ...blueprint.transaction,
                        date: dueDate,
                    } satisfies Transaction)
                    await repository.markBlueprintAsProcessed(
                        blueprint.key,
                        dueDate
                    )
                    // 'TODO wrap in database transaction?' end
                    results.push({
                        blueprintKey: blueprint.key,
                        status: 'OK',
                        datetime: dueDate,
                    })
                }
            } catch (error) {
                logger.error(error)
                results.push({
                    blueprintKey: blueprint.key,
                    status: 'ERROR',
                    datetime: new Date(),
                    message: `Inserting the blueprint ${blueprint.key} failed with error: ${error}`,
                })
            }
        }

        // Send notification
        await sendProcessedBlueprintResults(results)

        logger.info('Finished processing blueprints')
    },
    {
        scheduled: false,
        name: 'Task: insert transactions from blueprints',
    }
)
