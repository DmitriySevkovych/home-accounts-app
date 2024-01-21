import { BlueprintKey } from 'domain-model'

type ProcessedBlueprintStatus = 'OK' | 'ERROR'

export type ProcessedBlueprintResult = {
    blueprintKey: BlueprintKey
    status: ProcessedBlueprintStatus
    datetime: Date
    message?: string
}

export type ProcessedBlueprintResultsAggregate = {
    blueprintKey: BlueprintKey
    actions: {
        status: ProcessedBlueprintStatus
        datetime: Date
        message?: string
    }[]
}
