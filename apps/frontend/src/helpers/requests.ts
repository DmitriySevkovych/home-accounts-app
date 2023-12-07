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

async function _throwingFetch(...options: [string, object?]) {
    const res = await fetch(...options)
    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res)
    }
    return res
}

/*
    Helper functions
*/

const _withAuthorizationHeader = (): object => {
    return {
        Authorization: process.env['NEXT_PUBLIC_BACKEND_APIKEY'],
    }
}

/*
    Public wrappers around the throwing fetch requests
*/

export const getFromBackend = async (
    url: string,
    headers?: object
): Promise<Response> => {
    return await _throwingFetch(url, {
        method: 'GET',
        headers: {
            ..._withAuthorizationHeader(),
            ...headers,
        },
    })
}

export const postToBackend = async (
    url: string,
    body: object,
    headers?: object
): Promise<Response> => {
    return await _throwingFetch(url, {
        method: 'POST',
        body: body,
        headers: {
            ..._withAuthorizationHeader(),
            ...headers,
        },
    })
}

export const putToBackend = async (
    url: string,
    body: object,
    headers?: object
): Promise<Response> => {
    return await _throwingFetch(url, {
        method: 'PUT',
        body: body,
        headers: {
            ..._withAuthorizationHeader(),
            ...headers,
        },
    })
}
