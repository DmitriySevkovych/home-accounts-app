/*
    Wrap the Fetch API for easier error handling. For more details, see:
    https://www.builder.io/blog/safe-data-fetching
*/

export class ResponseError extends Error {
    response: Response

    constructor(message: string, res: Response) {
        super(message)
        this.response = res
    }
}

export const throwingFetch = async (
    ...options: [string, RequestInit?]
): Promise<Response> => {
    const res = await fetch(...options)
    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res)
    }
    return res
}

export const safeFetch = async (url: string, options?: RequestInit) => {
    const optionsWithAuthHeader = {
        method: options?.method,
        body: options?.body,
        headers: {
            authorization: process.env['NEXT_PUBLIC_BACKEND_API_KEY']!,
            ...options?.headers,
        },
    }

    return await throwingFetch(url, optionsWithAuthHeader)
}
