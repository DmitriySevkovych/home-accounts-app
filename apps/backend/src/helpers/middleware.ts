import { NextFunction, Request, Response } from 'express'
import { getHttpLogger } from 'logger'

const httpLogger = getHttpLogger('backend')

export const backendHttpLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    httpLogger(req, res)
    next()
}
