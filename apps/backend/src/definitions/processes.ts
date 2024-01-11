export type ProcessedBlueprintResult = {
    status: 'OK' | 'WARNING' | 'ERROR'
    datetime: Date
    message?: string[]
}
