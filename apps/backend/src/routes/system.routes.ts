import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'

import { getInfo } from '../helpers/system'

const getRouter = (): Router => {
    const router = express.Router()
    const httpLogger = getHttpLogger('backend')

    router.get('/info', async (req, res) => {
        httpLogger(req, res)
        res.status(200).json(getInfo())
    })

    return router
}

export default getRouter
