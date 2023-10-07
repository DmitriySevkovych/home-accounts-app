import { type Express } from 'express'

import investments from './investments.routes'
import system from './system.routes'
import transactions from './transactions.routes'
import utils from './utils.routes'

const mountRoutes = (app: Express) => {
    const baseUrl = process.env['API_BASE_URL']
    app.use(`${baseUrl}/system`, system())
    app.use(`${baseUrl}/utils`, utils())
    app.use(`${baseUrl}/transactions`, transactions())
    app.use(`${baseUrl}/investments`, investments())
}

export default mountRoutes
