import React from 'react'

import { Label } from '../lib/shadcn/Label'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'

type FrontendInfo = {
    environment: string
    tlsRejectUnauthorized: boolean
}

type BackendInfo = {
    environment: string
    host: string
    port: string
    db: string
    error?: string
}

export type SystemInfo = {
    frontend: Partial<FrontendInfo>
    backend: Partial<BackendInfo>
}

export const SystemInfoFooter = ({ frontend, backend }: SystemInfo) => {
    return (
        <footer className="place-self-center">
            <Popover>
                <PopoverTrigger>System information</PopoverTrigger>
                <PopoverContent className="grid gap-4">
                    <div>
                        <Label>Frontend Info</Label>
                        <div className="grid grid-cols-2 gap-1">
                            <p>Environment:</p>
                            <p>{frontend.environment}</p>
                            <p>TLS Reject Unauthorized:</p>
                            <p>
                                {frontend.tlsRejectUnauthorized
                                    ? 'active'
                                    : 'deactivated'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label>Backend Info</Label>
                        <div className="grid grid-cols-2 gap-1">
                            {backend.error && (
                                <p className="font-bold text-red-500">Error!</p>
                            )}
                            {backend.error && (
                                <p className="font-bold text-red-500">
                                    {backend.error}
                                </p>
                            )}
                            <p>Environment:</p>
                            <p>{backend.environment}</p>
                            <p>Host:</p>
                            <p>{backend.host}</p>
                            <p>Port:</p>
                            <p>{backend.port}</p>
                            <p>Database:</p>
                            <p>{backend.db}</p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </footer>
    )
}
