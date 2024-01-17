import { BlueprintKey } from 'domain-model'

export type ProcessedBlueprintResult = {
    blueprintKey: BlueprintKey
    status: 'OK' | 'WARNING' | 'ERROR'
    datetime: Date
    message?: string
}
