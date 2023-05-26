import { type Express } from 'express'

import utils from './utils'
import transactions from './transactions'

const mountRoutes = (app: Express) => {
    const baseUrl = process.env['API_BASE_URL']
    app.use(`${baseUrl}/utils`, utils())
    app.use(`${baseUrl}/transactions`, transactions())
}

export default mountRoutes
