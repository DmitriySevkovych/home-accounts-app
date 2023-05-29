import { Pool, type QueryResult } from 'pg'

type QueryCallback = (_err: Error, _result: QueryResult<any>) => void

const connectionPool = new Pool({
    /* CLIENT config */

    // user?: string, // default process.env.PGUSER || process.env.USER
    // password?: string or function, //default process.env.PGPASSWORD
    // host?: string, // default process.env.PGHOST
    // database?: string, // default process.env.PGDATABASE || user
    // port?: number, // default process.env.PGPORT
    // connectionString?: string, // e.g. postgres://user:password@host:5432/database
    // ssl?: any, // passed directly to node.TLSSocket, supports all tls.connect options
    // types?: any, // custom type parsers
    // statement_timeout: 1000, // number of milliseconds before a statement in query will time out, default is no timeout
    // query_timeout: 1000, // number of milliseconds before a query call will timeout, default is no timeout
    application_name: 'home-accounts-backend', // The name of the application that created this Client instance
    // connectionTimeoutMillis: 3000, // number of milliseconds to wait for connection, default is no timeout
    // idle_in_transaction_session_timeout?: number, // number of milliseconds before terminating any session with an open idle transaction, default is no timeout

    /* POOL Config, extends Client config */

    // number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded
    // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
    // idleTimeoutMillis: 0,

    // maximum number of clients the pool should contain. By default this is set to 10.
    // max?: number,

    // Default behavior is the pool will keep clients open & connected to the backend
    // until idleTimeoutMillis expire for each client and node will maintain a ref
    // to the socket on the client, keeping the event loop alive until all clients are closed
    // after being idle or the pool is manually shutdown with `pool.end()`.
    //
    // Setting `allowExitOnIdle: true` in the config will allow the node event loop to exit
    // as soon as all clients in the pool are idle, even if their socket is still open
    // to the postgres server.  This can be handy in scripts & tests
    // where you don't want to wait for your clients to go idle before your process exits.
    // allowExitOnIdle: true,
})

export const query = (text: string, params: any[], callback: QueryCallback) => {
    return connectionPool.query(text, params, callback)
}

export default connectionPool
