import { PoolClient } from 'pg'

export const tx = async <T>(
    client: PoolClient,
    callback: (_client: PoolClient) => T
) => {
    try {
        await client.query('BEGIN')
        try {
            const result = await callback(client)
            await client.query('COMMIT')
            return result
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        }
    } finally {
        client.release()
    }
}
