import { type Express } from 'express'

import analysis from './analysis.routes'
import investments from './investments.routes'
import system from './system.routes'
import transactions from './transactions.routes'
import utils from './utils.routes'
import work from './work.routes'

const mountRoutes = (app: Express) => {
    const baseUrl = process.env.API_BASE_URL
    app.use(`${baseUrl}/analysis`, analysis())
    app.use(`${baseUrl}/system`, system())
    app.use(`${baseUrl}/utils`, utils())
    app.use(`${baseUrl}/transactions`, transactions())
    app.use(`${baseUrl}/investments`, investments())
    app.use(`${baseUrl}/work`, work())
}

export default mountRoutes
