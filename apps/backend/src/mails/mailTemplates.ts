import { formatDateToWords } from 'domain-model'
import * as Handlebars from 'handlebars'

import {
    ProcessedBlueprintResult,
    ProcessedBlueprintResultsAggregate,
} from '../definitions/processes'

export type BlueprintMailTemplateContext = {
    date: Date
    database: string
    resultsAggregate: ProcessedBlueprintResultsAggregate[]
}

Handlebars.registerHelper('readableDate', (datetime: Date): string => {
    return formatDateToWords(datetime, { addTime: false, locale: 'en-US' })
})

export const compileBlueprintsHtml = (
    context: BlueprintMailTemplateContext
): string => {
    const template = Handlebars.compile(
        `<h1>Automatic update of {{database}}</h1>
        <h2>{{readableDate date}}</h2>
        
        {{#each resultsAggregate}}
        <section>
            <h4>Blueprint key: {{this.blueprintKey}}</h4>
            <ul>
            {{#each this.actions}}
                <li>
                    <p>{{readableDate this.datetime}} - status: {{this.status}}</p>
                    {{#if this.message}}
                    <p>Message: {{this.message}}</p>
                    {{/if}}
                </li>
            {{/each}}
            </ul>
        </section>
        {{/each}}`
    )

    return template(context)
}

export const aggregateBlueprintResults = (
    results: ProcessedBlueprintResult[]
): ProcessedBlueprintResultsAggregate[] => {
    const aggregates: ProcessedBlueprintResultsAggregate[] = []

    results.forEach((result) => {
        let aggregate = aggregates.find(
            (a) => a.blueprintKey === result.blueprintKey
        )
        if (!aggregate) {
            aggregate = {
                blueprintKey: result.blueprintKey,
                actions: [],
            }
            aggregates.push(aggregate)
        }
        aggregate.actions.push({
            status: result.status,
            datetime: result.datetime,
            message: result.message,
        })
    })
    return aggregates
}
