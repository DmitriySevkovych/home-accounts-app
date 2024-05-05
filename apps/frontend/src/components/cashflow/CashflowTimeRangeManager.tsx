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

export type CashflowTimeRange = {
    id: CashflowTimeRangeID
    from: Date
    until: Date
}

const _updateTimeRange = (
    currentTimeRange: CashflowTimeRange,
    value: Date,
    key: keyof Pick<CashflowTimeRange, 'from' | 'until'>
): CashflowTimeRange => {
    const update = { ...currentTimeRange }
    update[key] = value
    return update
}

const _getTimeRange = (id: CashflowTimeRangeID): CashflowTimeRange => {
    return {
        id,
        from: new Date(),
        until: new Date(),
    }
}

export const getDefaultTimeRange = (): CashflowTimeRange => {
    return _getTimeRange('lastThreeMonths')
}

type CashflowTimeRangeManager = {
    timeRange: CashflowTimeRange
    setTimeRange: React.Dispatch<React.SetStateAction<CashflowTimeRange>>
}

type CashflowTimeRangeItemProps = {
    id: string
    label: string | undefined
    children?: React.ReactNode
}

const CashflowTimeRangeItem: React.FC<CashflowTimeRangeItemProps> = ({
    id,
    label,
    children,
}) => {
    return (
        <div className="flex items-center space-x-3">
            <RadioGroupItem value={id} id={id} />
            <Label className="flex w-full space-x-4 font-normal" htmlFor={id}>
                {label ? label : children}
            </Label>
        </div>
    )
}

const CashflowTimeRangeManager: React.FC<CashflowTimeRangeManager> = ({
    timeRange,
    setTimeRange,
}) => {
    const { from, until } = timeRange

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="time-range">
                <AccordionTrigger>
                    <SectionHeading>Time range</SectionHeading>
                </AccordionTrigger>
                <AccordionContent>
                    <RadioGroup
                        value={timeRange.id}
                        onValueChange={(id: CashflowTimeRangeID) =>
                            setTimeRange(_getTimeRange(id))
                        }
                    >
                        {Object.values(cashflowTimeRanges).map(
                            (r: CashflowTimeRangeItemProps) => {
                                if (r.id !== 'custom') {
                                    return (
                                        <CashflowTimeRangeItem
                                            key={r.id}
                                            {...r}
                                        />
                                    )
                                }
                                return (
                                    <CashflowTimeRangeItem key={r.id} {...r}>
                                        <div className="flex flex-grow flex-col space-y-2">
                                            <span>from</span>
                                            <CalendarStandalone
                                                value={from}
                                                setValue={(val) =>
                                                    setTimeRange(
                                                        _updateTimeRange(
                                                            timeRange,
                                                            val,
                                                            'from'
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-grow flex-col space-y-2">
                                            <span>until</span>
                                            <CalendarStandalone
                                                value={until}
                                                setValue={(val) =>
                                                    setTimeRange(
                                                        _updateTimeRange(
                                                            timeRange,
                                                            val,
                                                            'until'
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </CashflowTimeRangeItem>
                                )
                            }
                        )}
                    </RadioGroup>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default CashflowTimeRangeManager
