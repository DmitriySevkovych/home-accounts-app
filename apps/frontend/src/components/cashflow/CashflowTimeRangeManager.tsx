import { TimeRange, TimeRangeCalculator } from 'domain-model'
import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../lib/shadcn/Accordion'
import { Label } from '../../lib/shadcn/Label'
import { RadioGroup, RadioGroupItem } from '../../lib/shadcn/Radio'
import { CalendarStandalone } from '../Calendar'
import { SectionHeading } from '../Typography'

export type CashflowTimeRangeID =
    | 'lastThreeMonths'
    | 'lastYear'
    | 'currentYear'
    | 'custom'

const cashflowTimeRanges = {
    lastThreeMonths: {
        id: 'lastThreeMonths' satisfies CashflowTimeRangeID,
        label: 'Last three months',
    },
    lastYear: {
        id: 'lastYear' satisfies CashflowTimeRangeID,
        label: 'Last year',
    },
    currentYear: {
        id: 'currentYear' satisfies CashflowTimeRangeID,
        label: 'Current year',
    },
    custom: {
        id: 'custom' satisfies CashflowTimeRangeID,
        label: undefined,
    },
} as const

export type CashflowTimeRange = TimeRange & { id: CashflowTimeRangeID }

const _getAdjustedTimeRange = (
    currentTimeRange: CashflowTimeRange,
    value: Date,
    key: keyof TimeRange
): CashflowTimeRange => {
    const update = { ...currentTimeRange }
    update[key] = value
    return update
}

const _getTimeRange = (id: CashflowTimeRangeID): CashflowTimeRange => {
    let from, until
    switch (id) {
        case 'lastThreeMonths':
            ;[from, until] = TimeRangeCalculator.fromEndOfLastMonth()
                .goBack(2, 'months')
                .toBeginningOfMonth()
                .get()
            break
        case 'lastYear':
            ;[from, until] = TimeRangeCalculator.fromEndOfLastYear()
                .goBack(11, 'months')
                .toBeginningOfMonth()
                .get()
            break
        case 'currentYear':
            ;[from, until] = TimeRangeCalculator.fromToday()
                .goBackToBeginningOfThisYear()
                .get()
            break
        case 'custom':
            from = new Date()
            until = new Date()
            break
        default:
            throw new Error(`Unknown time range '${id}'`)
    }
    return { id, from, until }
}

export const getDefaultTimeRange = (): CashflowTimeRange => {
    return _getTimeRange('lastThreeMonths')
}

type CashflowTimeRangeItemProps = {
    id: string
    label: string | undefined
}

const CashflowTimeRangeItem: React.FC<CashflowTimeRangeItemProps> = ({
    id,
    label,
}) => {
    return (
        <div className="flex items-center space-x-3">
            <RadioGroupItem value={id} id={id} />
            <Label className="flex w-full space-x-4 font-normal" htmlFor={id}>
                {label}
            </Label>
        </div>
    )
}

type CashflowTimeRangeManagerProps = {
    timeRange: CashflowTimeRange
    setTimeRange: React.Dispatch<React.SetStateAction<CashflowTimeRange>>
}

const CashflowTimeRangeManager: React.FC<CashflowTimeRangeManagerProps> = ({
    timeRange,
    setTimeRange,
}) => {
    const { from, until } = timeRange

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="time-range">
                <AccordionTrigger className="pb-0 pt-2">
                    <SectionHeading>Time range</SectionHeading>
                </AccordionTrigger>
                <AccordionContent>
                    <RadioGroup
                        value={timeRange.id}
                        onValueChange={(id: CashflowTimeRangeID) =>
                            setTimeRange(_getTimeRange(id))
                        }
                    >
                        {Object.values(cashflowTimeRanges)
                            .filter((r) => r.id !== 'custom')
                            .map((r) => (
                                <CashflowTimeRangeItem key={r.id} {...r} />
                            ))}

                        {/* class ml-8 compensates for left out radio button */}
                        <div className="ml-8 mt-2 grid grid-cols-2 items-center space-x-3">
                            <div className="flex flex-col space-y-2">
                                <span>from</span>
                                <CalendarStandalone
                                    value={from}
                                    setValue={(val) =>
                                        setTimeRange(
                                            _getAdjustedTimeRange(
                                                timeRange,
                                                val,
                                                'from'
                                            )
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span>until</span>
                                <CalendarStandalone
                                    value={until}
                                    setValue={(val) =>
                                        setTimeRange(
                                            _getAdjustedTimeRange(
                                                timeRange,
                                                val,
                                                'until'
                                            )
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </RadioGroup>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default CashflowTimeRangeManager
