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
    return new Date(Date.parse(dateString))
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
