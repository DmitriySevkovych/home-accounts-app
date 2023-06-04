import { TransactionDate } from '../dates'

/*
    @group unit
    @group domain
 */
describe('Tests for dealing with dates', () => {
    it("should create today's date sting in YYYY-MM-DD format", () => {
        // Arrange
        const expectedDateString = new Date().toISOString().split('T')[0]
        // Act
        const today = TransactionDate.today()
        const todayDateString = today.toString()
        // Assert
        expect(todayDateString).toBe(expectedDateString)
    })

    it('should not change a date sting in YYYY-MM-DD format', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = TransactionDate.fromString('2023-06-04')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date sting in YYYY-MM-DD format from a date string in a different format', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = TransactionDate.fromString('Sunday, June 4, 2023', 'DDDD')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })

    it('should create a date sting in YYYY-MM-DD format when date is queried from a database table', () => {
        // Arrange
        const expectedDateString = '2023-06-04'
        // Act
        const date = TransactionDate.fromDatabase('2023-06-04')
        // Assert
        expect(date.toString()).toBe(expectedDateString)
    })
})
