import { type TransactionContext, transactionContexts } from 'domain-model'
import { NextFunction, Request, Response } from 'express'
import { getHttpLogger } from 'logger'
import { RequestWithPagination, RequestWithTransactionContext } from '../definitions/requests'
import { getPaginationOptionsFromRequest } from './pagination'

const httpLogger = getHttpLogger('backend')

export const backendHttpLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    httpLogger(req, res)
    next()
}

const AUTH_APIKEY = process.env.AUTH_APIKEY
const AUTH_DISABLE = process.env.AUTH_DISABLE

export const checkAuthHeader = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (AUTH_DISABLE) {
        next()
        return
    }

    if (!AUTH_APIKEY) {
        res.status(500).json({
            "message": "Application is misconfigured."
        })
        return
    }

    const token = req.get("Authorization")

    if (!token) {
        httpLogger.logger.error(`Received request from ${req.headers.host} without an auth token!`)
        res.sendStatus(401)
    }
    else if (token !== AUTH_APIKEY) {
        httpLogger.logger.error(`Received request from ${req.headers.host} with a bad auth token!`)
        res.sendStatus(403)
    } else {
        next()
    }
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

export const pagination = (
    req: RequestWithPagination,
    _res: Response,
    next: NextFunction
): void => {
    req.paginationOptions = getPaginationOptionsFromRequest(req)
    next()
}

export const transactionContext = (
    req: RequestWithTransactionContext,
    res: Response,
    next: NextFunction
): void => {
    const context = req.query.context

    if (!transactionContexts.find(c => c === context)) {
        const message = `The request contains an unknown context as query parameter (context=${context}).`
        req.log.error({ message })
        res.status(400).json({ message })
        return
    }

    req.transactionContext = <TransactionContext>context
    next()
}


