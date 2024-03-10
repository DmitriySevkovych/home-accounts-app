import React from 'react'

import { Label } from '../lib/shadcn/Label'
import { Popover, PopoverContent, PopoverTrigger } from '../lib/shadcn/Popover'

type FrontendInfo = {
    environment: string
    branch?: string
    commit?: string
}

type BackendInfo = {
    environment: string
    host: string
    port: string
    db: string
    branch?: string
    commit?: string
    error?: string
}

export type SystemInfo = {
    frontend: Partial<FrontendInfo>
    backend: Partial<BackendInfo>
}

export const SystemInfoFooter = ({ frontend, backend }: SystemInfo) => {
    return (
        <footer className="mt-3 place-self-center">
            <Popover>
                <PopoverTrigger>System information</PopoverTrigger>
                <PopoverContent className="grid gap-8 border">
                    <div>
                        <Label>Frontend Info</Label>
                        <div className="grid grid-cols-2 gap-1">
                            <p>Environment:</p>
                            <p>{frontend.environment}</p>
                            {frontend.branch && (
                                <>
                                    <p>Branch:</p>
                                    <p>{frontend.branch}</p>
                                    <p>Commit:</p>
                                    <p>{frontend.commit?.substring(0, 7)}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label>Backend Info</Label>
                        <div className="grid grid-cols-2 gap-1">
                            {backend.error && (
                                <>
                                    <p className="font-bold text-red-500">
                                        Error!
                                    </p>
                                    <p className="font-bold text-red-500">
                                        {backend.error}
                                    </p>
                                </>
                            )}
                            <p>Environment:</p>
                            <p>{backend.environment}</p>
                            <p>Host:</p>
                            <p>{backend.host}</p>
                            <p>Port:</p>
                            <p>{backend.port}</p>
                            <p>Database:</p>
                            <p>{backend.db}</p>
                            {backend.branch && (
                                <>
                                    <p>Branch:</p>
                                    <p>{backend.branch}</p>
                                    <p>Commit:</p>
                                    <p>{backend.commit?.substring(0, 7)}</p>
                                </>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </footer>
    )
}
