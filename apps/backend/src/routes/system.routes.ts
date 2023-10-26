import express, { type Router } from 'express'

import { getInfo } from '../helpers/system'

const getRouter = (): Router => {
    const router = express.Router()

    router.get('/info', async (req, res) => {
        res.status(200).json(getInfo())
    })

    return router
}

export default getRouter
