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

export const checkIdIsInteger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        const message = `The request contains a malformed id in path (id=${id}).`
        req.log.error({ message })
        res.status(400).json({ message })
        return
    }

    next()
}
