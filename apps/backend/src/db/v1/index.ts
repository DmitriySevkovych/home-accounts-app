import { Client, type QueryResult } from 'pg'

type QueryCallback = (_err: Error, _result: QueryResult<any>) => void

const client = new Client({
    // user?: string, // default process.env.PGUSER || process.env.USER
    // password?: string or function, //default process.env.PGPASSWORD
    // host?: string, // default process.env.PGHOST
    // database?: string, // default process.env.PGDATABASE || user
    // port?: number, // default process.env.PGPORT
    // connectionString?: string, // e.g. postgres://user:password@host:5432/database
    // ssl?: any, // passed directly to node.TLSSocket, supports all tls.connect options
    // types?: any, // custom type parsers
    statement_timeout: 3000, // number of milliseconds before a statement in query will time out, default is no timeout
    query_timeout: 3000, // number of milliseconds before a query call will timeout, default is no timeout
    application_name: 'home-accounts-backend', // The name of the application that created this Client instance
    connectionTimeoutMillis: 10000, // number of milliseconds to wait for connection, default is no timeout
    idle_in_transaction_session_timeout: 10000, // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
})

export const query = (text: string, params: any[], callback: QueryCallback) => {
    return client.query(text, params, callback)
}

export default client
