/* 4xx */
export class BadQueryParameterInRequestError extends Error {}

export class UnsupportedTransactionContextError extends Error {}

export class NoRecordFoundInDatabaseError extends Error {}

/* 5xx */
export class BadEnvironmentVariableError extends Error {}

export class UndefinedOperationError extends Error {}
