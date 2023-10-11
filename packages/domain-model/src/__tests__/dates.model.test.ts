import { HomeAppDate } from '../dates.model'

/*
    @group unit
    @group domain
 */
describe('Tests for dealing with dates', () => {
    it("should create today's date string in YYYY-MM-DD format", () => {
        // Arrange
        const expectedDateString = new Date().toISOString().split('T')[0]
        // Act
        const today = HomeAppDate.today()
        const todayDateString = today.toString()
        // Assert
        expect(todayDateString).toBe(expectedDateString)
    })

    it('should not change a date string in YYYY-MM-DD format', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = HomeAppDate.fromString('2023-06-04')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date string in YYYY-MM-DD format from a date string in a different format', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = HomeAppDate.fromString('Sunday, June 4, 2023', 'DDDD')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date string in YYYY-MM-DD format when date is queried from a database table', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = HomeAppDate.fromDatabase('2023-06-04')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date string in YYYY-MM-DD format from a JS Date object', () => {
        // Arrange
        const jsDate = new Date('1995-12-17T03:24:00')
        const expectedDateString = '1995-12-17'
        // Act
        const date = HomeAppDate.fromJsDate(jsDate)
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date string in YYYY-MM-DD format from an ISO String', () => {
        // Arrange
        const expectedDateString = '2023-09-10'
        // Act
        const date = HomeAppDate.fromISO('2023-09-10T04:10:22.258Z')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })
})
