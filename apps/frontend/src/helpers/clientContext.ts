import { createContext } from 'react'

export type ClientContextProps = {
    appEnvironment: string
    backend: {
        host: string
        apiBase: string
        apiKey: string
    }
}

export const ClientContext = createContext({
    appEnvironment: process.env['APP_ENV']!,
    backend: {
        host: process.env['CLIENT_BACKEND_HOST']!,
        apiBase: process.env['BACKEND_API_BASE']!,
        apiKey: process.env['BACKEND_API_KEY']!,
    },
})
