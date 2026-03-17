import { USTVA } from 'domain-model'
import express, { Request, Response, type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get('/invoices', async (_, res) => {
        const data = {
            invoices: await repository.getProjectInvoices(),
        }
        res.status(200).json(data)
    })

    router.get('/ustva', async (req: Request, res: Response) => {
        const { owner, from, to } = req.query

        if (typeof owner !== 'string') {
            return res
                .status(404)
                .json({
                    message: 'Wrong transaction owner type (query parameter).',
                })
        } else if (!['Dmitriy', 'Ivanna'].includes(owner)) {
            return res
                .status(404)
                .json({
                    message: 'Wrong transaction owner given (query parameter).',
                })
        }

        if (typeof from !== 'string' || typeof to !== 'string') {
            return res
                .status(404)
                .json({ message: 'Wrong date range (query parameter).' })
        }

        const output = await repository.getOutputVATSummary(
            owner as 'Dmitriy' | 'Ivanna',
            from,
            to
        )
        const input = await repository.getInputVATSummaries(
            owner as 'Dmitriy' | 'Ivanna',
            from,
            to
        )

        const data = {
            input,
            output,
        } satisfies USTVA
        res.status(200).json(data)
    })

    return router
}

export default getRouter
