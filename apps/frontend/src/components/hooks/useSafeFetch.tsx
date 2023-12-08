import path from 'path'
import { useContext } from 'react'

import { ClientContext } from '../../helpers/clientContext'
import { throwingFetch } from '../../helpers/requests'

export const useSafeFetch = (): ((
    endpoint: string,
    options?: RequestInit
) => Promise<Response>) => {
    // Get client-side environment veriables from the client context
    const context = useContext(ClientContext)

    // Define a safer fetch function (safer = with auth header + throwing errors on bad status codes)
    const clientsideSafeFetch = async (
        endpoint: string,
        options?: RequestInit
    ) => {
        const { host, apiBase, apiKey } = context.backend

        const optionsWithAuthHeader = {
            method: options?.method,
            body: options?.body,
            headers: {
                authorization: apiKey,
                ...options?.headers,
            },
        }

        const url = new URL(path.join(apiBase, endpoint), host).toString()

        return await throwingFetch(url, optionsWithAuthHeader)
    }

    return clientsideSafeFetch
}
