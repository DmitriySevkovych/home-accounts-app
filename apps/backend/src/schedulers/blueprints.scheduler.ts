import { Transaction } from 'domain-model'
import { getLogger } from 'logger'
import * as cron from 'node-cron'

import { RepositoryLocator } from '../db/repositoryLocator'
import { ProcessedBlueprintResult } from '../definitions/processes'
import { sendProcessedBlueprintResults } from '../mails/send'

const logger = getLogger()

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
        logger.info('Start processing blueprints.')

        // Process blueprints (basically insert into db if blueprint transaction is due, or skip otherwise)
        const repository = RepositoryLocator.getRepository()
        const activeBlueprints = await repository.getActiveBlueprints()

        const results: ProcessedBlueprintResult[] = []
        for (let i = 0; i < activeBlueprints.length; i++) {
            const blueprint = activeBlueprints[i]
            logger.debug(`Start processing blueprint ${blueprint.key}.`)
            try {
                const timeoutAfterMs = process.env.PROCESS_BLUEPRINTS_TIMEOUT
                    ? parseInt(process.env.PROCESS_BLUEPRINTS_TIMEOUT)
                    : 5000
                const timeoutId = setTimeout(() => {
                    throw new Error(
                        `Timeout! Processing blueprint ${blueprint.key} took longer than ${timeoutAfterMs}ms`
                    )
                }, timeoutAfterMs)

                // Perform transaction inserts for every passed dueDate since the last uptade of the blueprint
                for (const dueDate of blueprint.getDatesWhenTransactionIsDue()) {
                    logger.debug(
                        `Processing blueprint ${blueprint.key}, due date ${dueDate}.`
                    )
                    // TODO wrap in database transaction?
                    await repository.createTransaction({
                        ...blueprint.transaction,
                        date: dueDate,
                    } satisfies Transaction)
                    logger.debug(
                        `Inserted blueprint transaction for blueprint ${blueprint.key}, due date ${dueDate}.`
                    )

                    await repository.markBlueprintAsProcessed(
                        blueprint.key,
                        dueDate
                    )
                    logger.debug(
                        `Blueprint ${blueprint.key} has been marked as processed on ${dueDate}.`
                    )
                    // 'TODO wrap in database transaction?' end
                    results.push({
                        blueprintKey: blueprint.key,
                        status: 'OK',
                        datetime: dueDate,
                    })
                    logger.info(
                        `Successfully processed blueprint ${blueprint.key} on ${dueDate}.`
                    )
                }

                clearTimeout(timeoutId)
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
        if (results.length > 0 && !process.env.MAIL_DISABLED) {
            await sendProcessedBlueprintResults(results)
        }

        logger.info('Finished processing blueprints.')
    },
    {
        scheduled: false,
        name: 'Task: insert transactions from blueprints',
    }
)
