import { ProcessedBlueprintResult } from '../definitions/processes'
import {
    BlueprintMailTemplateContext,
    aggregateBlueprintResults,
    compileBlueprintsHtml,
} from './mailTemplates'

/*
    @group unit
 */
describe('Mail templates tests:', () => {
    describe('Blueprint mail templates', () => {
        const firstBlueprintKey = 'AGGREGATION_TEST_1'
        const secondBlueprintKey = 'AGGREGATION_TEST_2'
        const results = [
            {
                blueprintKey: firstBlueprintKey,
                datetime: new Date('2024-01-20T03:00:00.000Z'),
                status: 'OK',
            },
            {
                blueprintKey: firstBlueprintKey,
                datetime: new Date('2024-01-21T04:10:00.000Z'),
                status: 'OK',
            },
            {
                blueprintKey: firstBlueprintKey,
                datetime: new Date('2024-01-22T05:20:00.000Z'),
                status: 'ERROR',
                message: 'error message',
            },
            {
                blueprintKey: secondBlueprintKey,
                datetime: new Date('2024-01-21'),
                status: 'OK',
            },
            {
                blueprintKey: secondBlueprintKey,
                datetime: new Date('2024-01-22'),
                status: 'OK',
            },
        ] satisfies ProcessedBlueprintResult[]

        it('should aggregate processed blueprints by key', () => {
            // Arrange -> see describes scope
            // Act
            const aggregate = aggregateBlueprintResults(results)
            // Assert
            expect(aggregate.length).toBe(2)

            expect(
                aggregate.filter((a) => a.blueprintKey === firstBlueprintKey)
                    .length
            ).toBe(1)
            expect(
                aggregate.filter((a) => a.blueprintKey === firstBlueprintKey)[0]
                    .actions.length
            ).toBe(3)

            expect(
                aggregate.filter((a) => a.blueprintKey === secondBlueprintKey)
                    .length
            ).toBe(1)
            expect(
                aggregate.filter(
                    (a) => a.blueprintKey === secondBlueprintKey
                )[0].actions.length
            ).toBe(2)
        })

        it('should compile HTML string', () => {
            // Arrange
            const context = {
                date: new Date('2024-01-23'),
                database: 'no db, just unit test',
                resultsAggregate: aggregateBlueprintResults(results),
            } satisfies BlueprintMailTemplateContext
            // Act
            const html = compileBlueprintsHtml(context)
            // Assert
            expect(html.replace(/\s/g, '')).toBe(
                `<h1>Automatic update of no db, just unit test</h1>
                <h2>23. January 2024</h2>
                
                <section>
                    <h4>Blueprint key: ${firstBlueprintKey}</h4>
                    <ul>
                        <li>
                            <p>20. January 2024 - status: OK</p>
                        </li>
                        <li>
                            <p>21. January 2024 - status: OK</p>
                        </li>
                        <li>
                            <p>22. January 2024 - status: ERROR</p>
                            <p>Message: error message</p>
                        </li>
                    </ul>
                </section>
                <section>
                    <h4>Blueprint key: ${secondBlueprintKey}</h4>
                    <ul>
                        <li>
                            <p>21. January 2024 - status: OK</p>
                        </li>
                        <li>
                            <p>22. January 2024 - status: OK</p>
                        </li>
                    </ul>
                </section>`.replace(/\s/g, '')
            )
        })
    }) //end 'Blueprint mail templates'
})
