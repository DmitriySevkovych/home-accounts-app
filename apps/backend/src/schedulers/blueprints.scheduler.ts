import * as cron from 'node-cron'

const DAILY_AT_307_AM: string = '7 3 * * *'

export const PROCESS_BLUEPRINTS_TASK: cron.ScheduledTask = cron.schedule(
    DAILY_AT_307_AM,
    () => {
        console.log('Insert transactions from blueprints task')
    },
    {
        scheduled: false,
        name: 'Task: insert transactions from blueprints',
    }
)
