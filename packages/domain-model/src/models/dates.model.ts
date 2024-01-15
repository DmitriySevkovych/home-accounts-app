type Weekday = {
    name: string
    number: number
}

export const DAYS = [
    {
        name: 'MONDAY',
        number: 1,
    },
    {
        name: 'TUESDAY',
        number: 2,
    },
    {
        name: 'WEDNESDAY',
        number: 3,
    },
    {
        name: 'THURSDAY',
        number: 4,
    },
    {
        name: 'FRIDAY',
        number: 5,
    },
    {
        name: 'SATURDAY',
        number: 6,
    },
    {
        name: 'SUNDAY',
        number: 0,
    },
] satisfies Weekday[]

const _padZero = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString()
}

export const formatDate = (date: Date): string => {
    const YYYY = date.getFullYear().toString()
    const MM = _padZero(date.getMonth() + 1)
    const DD = _padZero(date.getDate())
    return `${YYYY}-${MM}-${DD}`
}

export const formatDateToWords = (date: Date): string => {
    const year = date.getFullYear().toString()
    const month = date.toLocaleString('default', { month: 'long' })
    const day = _padZero(date.getDate())
    return `${day}. ${month} ${year}`
}

export const timestampFromString = (dateString: string): number => {
    return Date.parse(dateString)
}

export const dateFromString = (dateString: string): Date => {
    return handleUnwantedTimezoneShift(new Date(Date.parse(dateString)))
}

export const handleUnwantedTimezoneShift = (date: Date): Date => {
    const utcDate = _utcDate(date)

    if (date.getDate() > utcDate.getDate()) {
        return new Date(
            Date.UTC(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate() + 1
            )
        )
    } else if (date.getDate() < utcDate.getDate()) {
        return new Date(
            Date.UTC(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate() - 1
            )
        )
    } else {
        return utcDate
    }
}

export const getNumberOfDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
}

export const getMonthDifference = (start: Date, end: Date): number => {
    return (
        end.getMonth() -
        start.getMonth() +
        12 * (end.getFullYear() - start.getFullYear())
    )
}

export const addDays = (date: Date, days: number): Date => {
    const adjustedDate = new Date(date.valueOf())
    adjustedDate.setDate(date.getDate() + days)
    return handleUnwantedTimezoneShift(adjustedDate)
}

export const getNextDay = (date: Date): Date => addDays(date, 1)

export const getTomorrow = (): Date => addDays(new Date(), 1)

export const getNextWorkday = (date: Date): Date => {
    if (date.getUTCDay() === 6) {
        return addDays(date, 2)
    } else if (date.getUTCDay() === 0) {
        return addDays(date, 1)
    }
    return date
}

const _utcDate = (date: Date): Date => {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDate()
    return new Date(Date.UTC(year, month, day))
}

export class DateCheck {
    private date: Date

    constructor(date: Date) {
        this.date = date
    }

    static today() {
        return new DateCheck(new Date())
    }

    isBefore(otherDate: Date) {
        return this.date.valueOf() - otherDate.valueOf() < 0
    }

    isNotBefore(otherDate: Date) {
        return !this.isBefore(otherDate)
    }

    isAfter(otherDate: Date) {
        return this.date.valueOf() - otherDate.valueOf() > 0
    }

    isNotAfter(otherDate: Date) {
        return !this.isAfter(otherDate)
    }
}
