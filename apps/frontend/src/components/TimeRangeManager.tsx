import { TimeRange, TimeRangeCalculator } from 'domain-model'
import { CalendarClock } from 'lucide-react'
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../lib/shadcn/Dialog'
import { Label } from '../lib/shadcn/Label'
import { RadioGroup, RadioGroupItem } from '../lib/shadcn/Radio'
import { CalendarStandalone } from './Calendar'

export type TimeRangeID =
    | 'lastThreeMonths'
    | 'lastYear'
    | 'currentYear'
    | 'custom'

const timeRangeSelectionOptions = {
    lastThreeMonths: {
        id: 'lastThreeMonths' satisfies TimeRangeID,
        label: 'Last three months',
    },
    lastYear: {
        id: 'lastYear' satisfies TimeRangeID,
        label: 'Last year',
    },
    currentYear: {
        id: 'currentYear' satisfies TimeRangeID,
        label: 'Current year',
    },
    custom: {
        id: 'custom' satisfies TimeRangeID,
        label: undefined,
    },
} as const

export type TimeRangeSelection = TimeRange & { id: TimeRangeID }

const _getAdjustedTimeRange = (
    currentTimeRange: TimeRangeSelection,
    value: Date,
    key: keyof TimeRange
): TimeRangeSelection => {
    const update = { ...currentTimeRange }
    update[key] = value
    return update
}

const _getTimeRange = (id: TimeRangeID): TimeRangeSelection => {
    let timeRange
    switch (id) {
        case 'lastThreeMonths':
            timeRange = TimeRangeCalculator.fromEndOfLastMonth()
                .goBack(2, 'months')
                .toBeginningOfMonth()
                .get()
            break
        case 'lastYear':
            timeRange = TimeRangeCalculator.fromEndOfLastYear()
                .goBack(11, 'months')
                .toBeginningOfMonth()
                .get()
            break
        case 'currentYear':
            timeRange = TimeRangeCalculator.fromToday()
                .goBackToBeginningOfThisYear()
                .get()
            break
        case 'custom':
            timeRange = {
                from: new Date(),
                until: new Date(),
            } satisfies TimeRange
            break
        default:
            throw new Error(`Unknown time range '${id}'`)
    }
    return { id, ...timeRange }
}

export const getDefaultTimeRange = (): TimeRangeSelection => {
    return _getTimeRange('lastThreeMonths')
}

type TimeRangeItemProps = {
    id: string
    label: string | undefined
}

const TimeRangeItem: React.FC<TimeRangeItemProps> = ({ id, label }) => {
    return (
        <div className="flex items-center space-x-3">
            <RadioGroupItem value={id} id={id} />
            <Label className="flex w-full space-x-4 font-normal" htmlFor={id}>
                {label}
            </Label>
        </div>
    )
}

type TimeRangeManagerProps = {
    timeRange: TimeRangeSelection
    setTimeRange: React.Dispatch<React.SetStateAction<TimeRangeSelection>>
}

const TimeRangeManager: React.FC<TimeRangeManagerProps> = ({
    timeRange,
    setTimeRange,
}) => {
    const { from, until } = timeRange

    return (
        <Dialog>
            <DialogTrigger>
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-darkest p-0 font-medium text-white hover:bg-secondary-lighter">
                    <CalendarClock size={20} />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Time range</DialogTitle>

                    <RadioGroup
                        value={timeRange.id}
                        onValueChange={(id: TimeRangeID) =>
                            setTimeRange(_getTimeRange(id))
                        }
                    >
                        {Object.values(timeRangeSelectionOptions)
                            .filter((r) => r.id !== 'custom')
                            .map((r) => (
                                <TimeRangeItem key={r.id} {...r} />
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
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default TimeRangeManager
